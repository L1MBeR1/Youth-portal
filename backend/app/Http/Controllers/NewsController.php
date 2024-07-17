<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
            ->select('news.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->get();
        return response()->json($news);
    }



    /**
     * Список (новый)
     * 
     * Получение списка новостей (новый. использовать этот метод)
     * 
     * @group Новости
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam newsId int ID блога.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getNews(Request $request)
    {
        if (!Auth::user()->can('view', News::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }


        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $newsId = $request->query('newsId');
        $withAuthors = $request->query('withAuthors', false);
        $query = News::query();

        if ($withAuthors) {
            $query->join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
                ->select('news.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
        } elseif ($newsId) {
            $query->where('id', $newsId);
        }

        $news = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $news->currentPage(),
            'from' => $news->firstItem(),
            'last_page' => $news->lastPage(),
            'per_page' => $news->perPage(),
            'to' => $news->lastItem(),
            'total' => $news->total(),
        ];

        return $this->successResponse($news->items(), $paginationData, 200);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        try{
            if (!Auth::user()->can('create', News::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a news');
            }

            $this->validateRequest($request, $request->rules());

            // Создание новой новости с использованием проверенных данных
            $news = News::create(array_merge($request->validated(), [
                'status' => 'moderating',
                'author_id' => Auth::id(),
            ]));
            
            return $this->successResponse(['news' => $news], 'News created successfully', 200);
        }   catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }

    public function listNews(Request $request)
    {
        try{
            // TODO: добавить имя автора
            $userId = $request->query('userId');
            $newsId = $request->query('newsId');
            $currentUser = $request->query('currentUser');

            if ($userId) {
                $user = User::findOrFail($userId);
                return $this->successResponse([$user->news, $user->metadata]);

            } else if ($currentUser) {
                return $this->successResponse([Auth::user()->news, Auth::user()->metadata]);

            } 
            else if($newsId)
            {
                return $this->successResponse(User::findOrFail($newsId));
            }else {

                return $this->successResponse(News::all(), '', 200);
            }
        }   catch (ModelNotFoundException  $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsRequest $request, $id)
    {
        try{

            $news = News::findOrFail($id);

            if(!Auth::user()->can('update', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to update this news');
            }

            $this->validateRequest($request, $request->rules());
            $validatedData = $request->validated();
            $news->update($validatedData);

            return $this->successResponse(['news' => $news], 'Podcast updated successfully', 200);
        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }
    

    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        try{
            $news = News::findOrFail($id);

            // Проверка прав пользователя
            if (!Auth::user()->can('delete', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this news');
            }

            $news->delete();

            return $this->successResponse(['news' => $news], 'News deleted successfully', 200);
        }catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }


}

