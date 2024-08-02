<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StorePodcastRequest;
use App\Http\Requests\UpdatePodcastRequest;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use App\Traits\QueryBuilderTrait; //не уверен что это стоит того
use App\Traits\PaginationTrait;   //.

class PodcastController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
    public function getPodcastById($id)
    {
        $podcast = Podcast::find($id); //FIXME:
        if (!$podcast->status === 'published') {
            if (!Auth::user()->can('requestSpecificPodcast', [Podcast::class, $podcast])) {
                return $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }


        if ($podcast) {
            $podcast->increment('views');
        }

        $requiredFields = [
            "podcasts" => [
                "id",
                "title",
                "description",
                "content",
                "status",
                "created_at",
                "updated_at",
                "likes",
                "reposts",
                "views",
                "cover_uri",
            ],
            "user_metadata" => [
                "first_name",
                "last_name",
                "patronymic",
                "nickname",
                "profile_image_uri",
            ]
        ];

        $podcast = $this->connectFields($podcast->id, $requiredFields, Podcast::class);

        return $this->successResponse($podcast, '', 200);
    }



    private function formPagination($q): array
    {
        return [
            'current_page' => $q->currentPage(),
            // 'from' => $q->firstItem(),
            'last_page' => $q->lastPage(),
            'per_page' => $q->perPage(),
            // 'to' => $q->lastItem(),
            'total' => $q->total(),
        ];
    }

    private function checkSearchPermissions(Request $request)
    {
        if ($request->hasAny(['status', 'searchColumnName', 'searchValue', 'searchFields', 'searchValues'])) {
            if (!Auth::user()->can('search', Podcast::class)) {
                $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }
    }


    /**
     * Показать список ресурса.
     * 
     * @group Подкасты
     * 
     * 
     */
    public function index()
    {
        $podcasts = Podcast::join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
            ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->get();
        return response()->json($podcasts);
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
     * @urlParam operator string Логический оператор для условий поиска ('and' или 'or').
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    // public function getPodcasts(Request $request)
    // {//TODO: Переделать
    //     if (!Auth::user()->can('view', Podcast::class)) {
    //         return $this->errorResponse('Нет прав на просмотр', [], 403);
    //     }

    //     $perPage = $request->get('per_page', 5);
    //     $userId = $request->query('userId');
    //     $currentUser = $request->query('currentUser');
    //     $podcastId = $request->query('podcastId');
    //     $withAuthors = $request->query('withAuthors', false);
    //     $searchFields = $request->query('searchFields', []);
    //     $searchValues = $request->query('searchValues', []);
    //     $searchColumnName = $request->query('searchColumnName');
    //     $searchValue = $request->query('searchValue');
    //     $tagFilter = $request->query('tagFilter');
    //     $crtFrom = $request->query('crtFrom');
    //     $crtTo = $request->query('crtTo');
    //     $updFrom = $request->query('updFrom');
    //     $updTo = $request->query('updTo');

    //     $updDate = $request->query('updDate');
    //     $crtDate = $request->query('crtDate');

    //     $operator = $request->query('operator', 'and');

    //     $query = Podcast::query();

    //     if ($withAuthors) {
    //         $query->join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
    //             ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
    //     }

    //     if ($userId) {
    //         $user = User::find($userId);
    //         if (!$user) {
    //             return $this->errorResponse('User not found', [], 404);
    //         }
    //         $query->where('author_id', $userId);
    //     } elseif ($currentUser) {
    //         $currentUser = Auth::user();
    //         if ($currentUser) {
    //             $query->where('author_id', $currentUser->id);
    //         } else {
    //             return $this->errorResponse('Current user not found', [], 404);
    //         }
    //     } elseif ($podcastId) {
    //         $query->where('id', $podcastId);
    //         $podcast = $query->first(); // Получаем первый подкаст, соответствующий запросу
    //         if ($podcast) {
    //             $podcast->increment('views'); // Инкрементируем счетчик просмотров
    //         }
    //     }


    //     if (!empty($searchFields) && !empty($searchValues)) {
    //         if ($operator === 'or') {
    //             $query->where(function ($query) use ($searchFields, $searchValues) {
    //                 foreach ($searchFields as $index => $field) {
    //                     $value = $searchValues[$index] ?? null;
    //                     if ($value) {
    //                         $query->orWhere($field, 'LIKE', '%' . $value . '%');
    //                     }
    //                 }
    //             });
    //         } else {
    //             foreach ($searchFields as $index => $field) {
    //                 $value = $searchValues[$index] ?? null;
    //                 if ($value) {
    //                     $query->where($field, 'LIKE', '%' . $value . '%');
    //                 }
    //             }
    //         }
    //     }

    //     if ($searchColumnName) {
    //         $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
    //     }

    //     if ($tagFilter) {
    //         $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
    //     }

    //     $crtFrom = $this->parseDate($crtFrom);
    //     $crtTo = $this->parseDate($crtTo);
    //     $updFrom = $this->parseDate($updFrom);
    //     $updTo = $this->parseDate($updTo);

    //     if ($crtFrom && $crtTo) {
    //         $query->whereBetween('created_at', [$crtFrom, $crtTo]);
    //     } elseif ($crtFrom) {
    //         $query->where('created_at', '>=', $crtFrom);
    //     } elseif ($crtTo) {
    //         $query->where('created_at', '<=', $crtTo);
    //     }

    //     if ($updFrom && $updTo) {
    //         $query->whereBetween('updated_at', [$updFrom, $updTo]);
    //     } elseif ($updFrom) {
    //         $query->where('updated_at', '>=', $updFrom);
    //     } elseif ($updTo) {
    //         $query->where('updated_at', '<=', $updTo);
    //     }

    //     if ($crtDate) {
    //         $query->whereDate('created_at', '=', $crtDate);
    //     }

    //     if ($updDate) {
    //         $query->whereDate('updated_at', '=', $updDate);
    //     }

    //     $podcasts = $query->paginate($perPage);

    //     $paginationData = [
    //         'current_page' => $podcasts->currentPage(),
    //         'from' => $podcasts->firstItem(),
    //         'last_page' => $podcasts->lastPage(),
    //         'per_page' => $podcasts->perPage(),
    //         'to' => $podcasts->lastItem(),
    //         'total' => $podcasts->total(),
    //     ];

    //     return $this->successResponse($podcasts->items(), $paginationData, 200);
    // }

    public function getPodcasts(Request $request)
    {
        if (!Auth::user()->can('viewAny', Podcast::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $this->checkSearchPermissions($request);
        $query = $this->buildPodcastQuery($request);

        $podcasts = $query->paginate($perPage);
        $paginationData = $this->formPagination($podcasts);
        return $this->successResponse($podcasts->items(), $paginationData, 200);
    }

    private function buildPodcastQuery(Request $request): \Illuminate\Database\Eloquent\Builder
    {
        $query = Podcast::query();
        $this->joinAuthors($query);
        $this->applyFilters($query, $request);
        $this->applySearch($query, $request);
        return $query;
    }

    private function joinAuthors($query)
    {
        $query->join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
            ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
    }

    private function applyFilters($query, Request $request)
    {
        if ($userId = $request->query('userId')) {
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $query->where('author_id', $userId);
        } elseif ($podcastId = $request->query('podcastId')) {
            $query->where('id', $podcastId);
            $podcast = $query->first();
            if ($podcast) {
                $podcast->increment('views');
            }
        }

        $this->applyDateFilters($query, $request);
        $this->applyStatusFilter($query, $request);
    }

    protected function applyDateFilters($query, Request $request)
    {
        if ($crtFrom = $request->query('crtFrom')) {
            $query->whereDate('created_at', '>=', Carbon::parse($crtFrom));
        }

        if ($crtTo = $request->query('crtTo')) {
            $query->whereDate('created_at', '<=', Carbon::parse($crtTo));
        }

        if ($updFrom = $request->query('updFrom')) {
            $query->whereDate('updated_at', '>=', Carbon::parse($updFrom));
        }

        if ($updTo = $request->query('updTo')) {
            $query->whereDate('updated_at', '<=', Carbon::parse($updTo));
        }

        if ($crtDate = $request->query('crtDate')) {
            $query->whereDate('created_at', Carbon::parse($crtDate));
        }

        if ($updDate = $request->query('updDate')) {
            $query->whereDate('updated_at', Carbon::parse($updDate));
        }
    }

    private function applyStatusFilter($query, Request $request)
    {
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
    }

    private function applySearch($query, Request $request)
    {
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $operator = $request->query('operator', 'and');

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if (!empty($searchFields) && !empty($searchValues)) {
            if ($operator === 'or') {
                $query->where(function ($query) use ($searchFields, $searchValues) {
                    foreach ($searchFields as $index => $field) {
                        $value = $searchValues[$index] ?? null;
                        if ($value) {
                            $query->orWhere($field, 'LIKE', '%' . $value . '%');
                        }
                    }
                });
            } else {
                foreach ($searchFields as $index => $field) {
                    $value = $searchValues[$index] ?? null;
                    if ($value) {
                        $query->where($field, 'LIKE', '%' . $value . '%');
                    }
                }
            }
        }

        if ($tagFilter = $request->query('tagFilter')) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }
    }

    /**
     * Мои подкасты
     *
     * Получение списка подкастов для текущего пользователя
     *
     * @group Подкасты
     *
     * @authenticated
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam status string Статус подкаста (moderating, published)
     *
     * @urlParam page int Номер страницы.
     * @urlParam perPage int Количество элементов на странице.
     */
    public function getOwnPodcasts(Request $request)
    {
        $user = Auth::user();

        if (!$user->can('viewOwnPodcasts', Podcast::class)) {
            return $this->errorResponse('You do not have permission to view your own podcasts.', [], 403);
        }

        $query = Podcast::where('author_id', $user->id);

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');
        $podcastStatus = $request->query('status');

        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at', 'status', 'title'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        }

        if ($podcastStatus) {
            $query->where('status', $podcastStatus);
        }

        $perPage = $request->query('per_page');
        $podcasts = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($podcasts);
        return $this->successResponse($podcasts->items(), $paginationData, 200);
    }






    /**
     * Список опубликованных подкастов
     *
     * Описание
     *
     * @group Подкасты
     *
     * @authenticated
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam userId int ID пользователя.
     *
     */
    public function getPublishedPodcasts(Request $request)
    {
        // Без авторизации
        // if (!Auth::user()->can('viewPublishedPodcasts', Podcast::class)) {
        //     return $this->errorResponse('Нет прав на просмотр', [], 403);
        // }

        $query = Podcast::where('status', 'published');
        $query->leftJoin('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id');
        $query->select(
            'podcasts.id',
            'podcasts.title',
            'podcasts.description',
            'podcasts.created_at',
            'podcasts.updated_at',
            'podcasts.likes',
            'podcasts.reposts',
            'podcasts.views',
            'podcasts.cover_uri',
            'user_metadata.nickname',
            'user_metadata.first_name',
            'user_metadata.last_name',
            'user_metadata.profile_image_uri',
        );

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');

        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        if ($userId = $request->query('userId')) {
            $query->where('podcasts.author_id', $userId);
        }

        $perPage = $request->query('per_page');
        $podcasts = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($podcasts);
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
        if (!Auth::user()->can('create', Podcast::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $podcast = Podcast::create($request->validated() + [
            'status' => 'moderating',
            'author_id' => Auth::id(),
        ]);

        return $this->successResponse(['podcast' => $podcast], 'Podcast created successfully', 200);
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
        $podcast = Podcast::find($id);

        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $podcast)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $validatedData = $request->validated();
        $podcast->update($validatedData);

        return $this->successResponse(['podcast' => $podcast], 'Podcast updated successfully', 200);
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
        $newStatus = $request->input('status');
        $podcast = Podcast::find($id);

        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('updateStatus', $podcast)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        if (!in_array($newStatus, Podcast::STATUSES)) {
            return $this->errorResponse('Invalid status entered', [], 404);
        }

        $podcast->update(['status' => $newStatus]);

        return $this->successResponse(['podcasts' => $podcast], 'Podcast status updated successfully', 200);
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
        $podcast = Podcast::find($id);

        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        // Проверка прав пользователя
        if (!Auth::user()->can('delete', $podcast)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $podcast->delete();

        return $this->successResponse(['podcast' => $podcast], 'Podcast deleted successfully', 200);
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
        $podcast = Podcast::find($id);
        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }
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
    }
}
