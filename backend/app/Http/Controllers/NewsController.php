<?php

namespace App\Http\Controllers;

use Exception;
use Carbon\Carbon;
use App\Models\News;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use App\Traits\QueryBuilderTrait; //не уверен что это стоит того
use App\Traits\PaginationTrait;   //.

class NewsController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
    public function getNewsById($id)
    {
        $news = News::find($id); //FIXME:
        if ($news->status !== 'published') {
            if (!Auth::user()->can('requestSpecificNews', [News::class, $news])) {
                return $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }
        
        
        if ($news) {
            $news->increment('views');
        }
        
        $requiredFields = [
            "news" => [
                "id",
                "title",
                "description",
                "status",
                "content",
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
            
        $news = $this->connectFields($news->id, $requiredFields, News::class);

        return $this->successResponse($news, '', 200);
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
    /**
     * Список
     * 
     * Получение списка новостей
     * 
     * @group Новости
     * 
     * 
     */
    public function index()
    {
        $news = News::join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
            ->select('news.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->get();
        return response()->json($news);
    }


    private function checkSearchPermissions(Request $request)
    {
        if ($request->hasAny(['status', 'searchColumnName', 'searchValue', 'searchFields', 'searchValues'])) {
            if (!Auth::user()->can('search', News::class)) {
                $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }
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
     * @bodyParam newsId int ID новости.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
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
    // public function getNews(Request $request)
    // {//TODO: Переделать
    //     if (!Auth::user()->can('viewAny', News::class)) {
    //         return $this->errorResponse('Нет прав на просмотр', [], 403);
    //     }

    //     $perPage = $request->get('per_page', 5);
    //     $userId = $request->query('userId');
    //     $currentUser = $request->query('currentUser');
    //     $newsId = $request->query('newsId');
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

    //     $this->checkSearchPermissions($request);

    //     $query = News::query();

    //     if ($withAuthors) {
    //         $query->join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
    //             ->select('news.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
    //     } elseif ($newsId) {
    //         $query->where('id', $newsId);
    //         $news = $query->first(); 
    //         if ($news) {
    //             $news->increment('views'); 
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

    //     $news = $query->paginate($perPage);

    //     $paginationData = [
    //         'current_page' => $news->currentPage(),
    //         'from' => $news->firstItem(),
    //         'last_page' => $news->lastPage(),
    //         'per_page' => $news->perPage(),
    //         'to' => $news->lastItem(),
    //         'total' => $news->total(),
    //     ];

    //     return $this->successResponse($news->items(), $paginationData, 200);
    // }


    public function getNews(Request $request)
    {
        if (!Auth::user()->can('viewAny', News::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $this->checkSearchPermissions($request);
        $query = $this->buildNewsQuery($request);

        $news = $query->paginate($perPage);
        $paginationData = $this->formPagination($news);
        return $this->successResponse($news->items(), $paginationData, 200);
    }

    private function buildNewsQuery(Request $request): \Illuminate\Database\Eloquent\Builder
    {
        $query = News::query();
        $this->joinAuthors($query);
        $this->applyFilters($query, $request);
        $this->applySearch($query, $request);
        return $query;
    }

    private function joinAuthors($query)
    {
        $query->join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
            ->select(
                'news.*', 
                'user_metadata.first_name', 
                'user_metadata.last_name', 
                'user_metadata.patronymic', 
                'user_metadata.nickname',
                'user_metadata.profile_image_uri'
            );
    }

    private function applyFilters($query, Request $request)
    {
        if ($userId = $request->query('userId')) {
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $query->where('author_id', $userId);
        } elseif ($newsId = $request->query('newsId')) {
            $query->where('id', $newsId);
            $news = $query->first();
            if ($news) {
                $news->increment('views');
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
     * Мои новости
     *
     * Получение списка новостей для текущего пользователя
     *
     * @group Новости
     *
     * @authenticated
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam status string Статус блога (moderating, published)
     *
     * @urlParam page int Номер страницы.
     * @urlParam perPage int Количество элементов на странице.
     */
    public function getOwnNews(Request $request)
    {
        $user = Auth::user();

        if (!$user->can('viewOwnNews', News::class)) {
            return $this->errorResponse('You do not have permission to view your own news.', [], 403);
        }

        $query = News::where('author_id', $user->id);

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');
        $newsStatus = $request->query('status');

        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at', 'status', 'title'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        }

        if ($newsStatus) {
            $query->where('status', $newsStatus);
        }

        $perPage = $request->query('perPage');
        $news = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($news);
        return $this->successResponse($news->items(), $paginationData, 200);
    }






    /**
     * Список опубликованных новостей
     *
     * Получение списка опубликованных новостей
     *
     * @group Новости
     *
     * @authenticated
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam userId int ID пользователя.
     *
     */
    public function getPublishedNews(Request $request)
    {
        // Без авторизации
        // if (!Auth::user()->can('viewPublishedNews', News::class)) {
        //     return $this->errorResponse('Нет прав на просмотр', [], 403);
        // }

        $query = News::where('status', 'published');
        $query->leftJoin('user_metadata', 'news.author_id', '=', 'user_metadata.user_id');
        $query->select(
            'news.id',
            'news.title',
            'news.description',
            'news.created_at',
            'news.updated_at',
            'news.likes',
            'news.reposts',
            'news.views',
            'news.cover_uri',
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
            $query->where('news.author_id', $userId);
        }

        $perPage = $request->query('per_page');
        $news = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($news);
        return $this->successResponse($news->items(), $paginationData, 200);
    }


    /**
     * Создать
     * 
     * Создание новости
     * 
     * @group Новости
     * 
     * @bodyParam title string required Название
     * @bodyParam description string required Описание
     * @bodyParam content string required Содержание
     * 
     * @bodyParam cover_uri string Картинка
     * 
     * 
     */
    public function store(StoreNewsRequest $request)
    {
        if (!Auth::user()->can('create', News::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $news = News::create($request->validated() + [
            'status' => 'moderating',
            'author_id' => Auth::id(),
        ]);            

        return $this->successResponse(['news' => $news], 'Новость успешно создана', 200);
    }

    public function likeNews(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        $user = Auth::user();

        $like = $news->likes()->where('user_id', $user->id)->first();

        if ($like) {
            // Если пользователь уже лайкнул эту новость, и опять нажал на лайк то удаляем лайк
            $like->delete();
            $news->decrement('likes');
            return $this->successResponse(['news' => $news], 'News unliked successfully', 200);
        } else {
            // Иначе добавляем новый лайк
            $news->likes()->create(['user_id' => $user->id]);
            $news->increment('likes');
        }

        return $this->successResponse(['news' => $news], 'News liked successfully', 200);
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
     * Обновить
     * 
     * Обновление статуса новости
     * 
     * @group Новости
     * 
     * @bodyParam status string required Статус
     */
    public function updateStatus(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        $newStatus = $request->input('status');
        $news = News::find($id);

        if (!$news) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('updateStatus', $news)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        if (!in_array($newStatus, News::STATUSES)) {
            return $this->errorResponse('Invalid status entered', [], 404);
        }

        $news->update(['status' => $newStatus]);

        return $this->successResponse(['news' => $news], 'News status updated successfully', 200);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param UpdateNewsRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateNewsRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $news)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $news->update($request->validated());

        return $this->successResponse(['news' => $news], 'News updated successfully', 200);
    }

    /**
     * Удалить
     * 
     * Удаление новости
     * 
     * @group Новости
     * 
     * @authenticated
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        $news = News::find($id);

        if (!$news) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('delete', $news)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $news->delete();

        return $this->successResponse(['news' => $news], 'News deleted successfully', 200);
    }
}

