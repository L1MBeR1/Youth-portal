<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\UpdatePodcastRequest;
use App\Http\Requests\StorePodcastRequest;   
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PodcastController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $podkasts = Podcast::join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
                ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
                ->get();
        return response()->json($podkasts);
    }


    /**
     * Список (новый)
     * 
     * Получение списка подкастов (новый. использовать этот метод)
     * 
     * @group Подкасты
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam podcastId int ID подкаста.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getPodcasts(Request $request)
    {
        if (!Auth::user()->can('view', Podcast::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }


        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $podcastId = $request->query('podcastId');
        $withAuthors = $request->query('withAuthors', false);
        $query = Podcast::query();

        if ($withAuthors) {
            $query->join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
                ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
        }

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $query->where('author_id', $userId);
        } elseif ($currentUser) {
            $currentUser = Auth::user();
            if ($currentUser) {
                $query->where('author_id', $currentUser->id);
            } else {
                return $this->errorResponse('Current user not found', [], 404);
            }
        } elseif ($podcastId) {
            $query->where('id', $podcastId);
        }

        $podcasts = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $podcasts->currentPage(),
            'from' => $podcasts->firstItem(),
            'last_page' => $podcasts->lastPage(),
            'per_page' => $podcasts->perPage(),
            'to' => $podcasts->lastItem(),
            'total' => $podcasts->total(),
        ];

        return $this->successResponse($podcasts->items(), $paginationData, 200);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePodcastRequest $request)
    {
        try {
            // Проверка прав пользователя
            if (!Auth::user()->can('create', Podcast::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a podcast');
            }

            $this->validateRequest($request, $request->rules());

            // Создание нового подкаста с использованием проверенных данных
            $podcast = Podcast::create(array_merge($request->validated(), [
                'status' => 'moderating',
                'author_id' => Auth::id(),
            ]));
            return $this->successResponse(['podcast' => $podcast], 'Podcast created successfully', 200);
        } catch (AccessDeniedHttpException $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Podcast $podcast)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Podcast $podcast)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePodcastRequest $request, $id)
    {
        try{

            $podcast = Podcast::findOrFail($id);

            if(!Auth::user()->can('update', $podcast)) {
                throw new AccessDeniedHttpException('You do not have permission to update this podcast');
            }

            $this->validateRequest($request, $request->rules());
            $validatedData = $request->validated();
            $podcast->update($validatedData);

            return $this->successResponse(['podcast' => $podcast], 'Podcast updated successfully', 200);
        } catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        } catch (ModelNotFoundException $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try{
            $podcast = Podcast::findOrFail($id);

            // Проверка прав пользователя
            if (!Auth::user()->can('delete', $podcast)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this podcast');
            }

            $podcast->delete();

            return $this->successResponse(['podcast' => $podcast], 'Podcast deleted successfully', 200);
        }catch (Exception $e) {
            return $this->handleException($e);
        } catch (ModelNotFoundException $e) {
            return $this->handleException($e);
        }
    }
}
