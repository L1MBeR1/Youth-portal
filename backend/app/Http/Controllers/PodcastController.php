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
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtDate string Дата создания (формат: Y-m-d).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updDate string Дата обновления (формат: Y-m-d).
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getPodcasts(Request $request)
    {//TODO: Переделать
        if (!Auth::user()->can('view', Podcast::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $podcastId = $request->query('podcastId');
        $withAuthors = $request->query('withAuthors', false);
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

        $updDate = $request->query('updDate');
        $crtDate = $request->query('crtDate');

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


        if (!empty($searchFields) && !empty($searchValues)) {
            foreach ($searchFields as $index => $field) {
                $value = $searchValues[$index] ?? null;
                if ($value) {
                    $query->where($field, 'LIKE', '%' . $value . '%');
                }
            }
        }

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if ($tagFilter) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }

        $crtFrom = $this->parseDate($crtFrom);
        $crtTo = $this->parseDate($crtTo);
        $updFrom = $this->parseDate($updFrom);
        $updTo = $this->parseDate($updTo);

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

        if ($crtDate) {
            $query->whereDate('created_at', '=', $crtDate);
        }
    
        if ($updDate) {
            $query->whereDate('updated_at', '=', $updDate);
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
     * Parses the date from the given input.
     * Supports both Y-m-d H:i:s and Y-m-d formats.
     * 
     * @param string|null $date
     * @return string|null
     */
    private function parseDate($date)
    {
        if (!$date) {
            return null;
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date . ' 00:00:00';
        }

        return $date;
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
            if (!Auth::user()->can('create', Podcast::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a podcast');
            }

            $this->validateRequest($request, $request->rules());

            $podcast = Podcast::create(array_merge($request->validated(), [
                'status' => 'moderating',
                'author_id' => Auth::id(),
            ]));
            return $this->successResponse(['podcast' => $podcast], 'Podcast created successfully', 200);
        } catch (AccessDeniedHttpException $e) {
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
        } catch (AccessDeniedHttpException | ModelNotFoundException $e) {
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
    public function updateStatus(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $newStatus = $request->input('status');
            $podcast = Podcast::findOrFail($id);

            if (!$podcast) {
                return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
            }

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
        }catch (Exception | ModelNotFoundException$e) {
            return $this->handleException($e);
        }
    }

    /**
     * Лайкнуть подкаст
     * 
     * Этот метод позволяет пользователю "лайкнуть" или "дизлайкнуть" подкаст.
     * 
     * @group    Подкасты
     * 
     * @urlParam id int Обязательно. Идентификатор подкаста.
     * 
     * @response 200 {
     *   "podcasts": {
     *     "id": 1,
     *     "title": "Название подкаста",
     *     "description": "Описание подкаста",
     *     "content": "Содержание подкаста",
     *     "cover_uri": "URI обложки подкаста",
     *     "status": "Статус подкаста",
     *     "views": 100,
     *     "likes": 50,
     *     "reposts": 20
     *   },
     *   "message": "Podcast liked successfully"
     * }
     * 
     * @response 200 {
     *   "podcasts": {
     *     "id": 1,
     *     "title": "Название подкаста",
     *     "description": "Описание подкаста",
     *     "content": "Содержание подкаста",
     *     "cover_uri": "URI обложки подкаста",
     *     "status": "Статус подкаста",
     *     "views": 100,
     *     "likes": 49,
     *     "reposts": 20
     *   },
     *   "message": "Podcast unliked successfully"
     * }
     */
    public function likePodcast(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $podcast = Podcast::findOrFail($id);
            $user = Auth::user();

            $like = $podcast->likes()->where('user_id', $user->id)->first();

            if ($like) {
                $like->delete();
                $podcast->decrement('likes');
                return $this->successResponse(['podcasts' => $podcast], 'Podcast unliked successfully', 200);
            } else {
                $podcast->likes()->create(['user_id' => $user->id]);
                $podcast->increment('likes');
            }

            return $this->successResponse(['podcasts' => $podcast], 'Podcast liked successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->handleException($e);
        }
    }
}
