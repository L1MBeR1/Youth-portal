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
     * Показать список ресурса.
     * 
     * @group Подкасты
     * 
     * 
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
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s).
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
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

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

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if ($tagFilter) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }

        if ($crtFrom && $crtTo) {
            $query->whereBetween('created_at', [$crtFrom, $crtTo]);
        } elseif ($crtFrom) {
            $query->where('created_at', '>=', $crtFrom);
        } elseif ($crtTo) {
            $query->where('created_at', '<=', $crtTo);
        }

        if ($updFrom && $updTo) {
            $query->whereBetween('updated_at', [$updFrom, $updTo]);
        } elseif ($updFrom) {
            $query->where('updated_at', '>=', $updFrom);
        } elseif ($updTo) {
            $query->where('updated_at', '<=', $updTo);
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
     * Создать 
     * 
     * Создание нового подкаста
     * 
     * @group Подкасты
     * 
     * @authenticated
     * 
     * @bodyParam title string Название.
     * @bodyParam description string Описание.
     * @bodyParam content string Содержание.
     * @bodyParam cover_uri string URI обложки.
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
     * Обновить
     * 
     * Обновление подкаста
     * 
     * @group    Подкасты
     * 
     * @bodyParam title string Название.
     * @bodyParam description string Описание.
     * @bodyParam content string Содержание.
     * @bodyParam cover_uri string URI обложки.
     * @bodyParam status string Статус.
     * @bodyParam views int Количество просмотров.
     * @bodyParam likes int Количество лайков.
     * @bodyParam reposts int Количество репостов.
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
     * Обновить
     * 
     * Обновление статуса подкаста
     * 
     * @group Подкасты
     * 
     * @bodyParam status string required Статус
     */
    public function updateStatus(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $newStatus = $request->input('status');
            $podcast = Podcast::findOrFail($id);

            if (!Auth::user()->can('updateStatus', $podcast)) {
                throw new AccessDeniedHttpException('You do not have permission to update the status of this podcast');
            }

            if (!in_array($newStatus, Podcast::STATUSES)) {
                return $this->errorResponse('Invalid status entered', [], 404);
            }

            $podcast->update(['status' => $newStatus]);

            return $this->successResponse(['podcasts' => $podcast], 'Podcast status updated successfully', 200);
        } catch (ModelNotFoundException | AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
    }


    /**
     * Удалить
     * 
     * Удаление подкаста
     * 
     * @group    Подкасты
     * 
     * @authenticated
     *
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
