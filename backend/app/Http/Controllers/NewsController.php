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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class NewsController extends Controller
{
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
    public function getNews(Request $request)
    {//TODO: Переделать
        if (!Auth::user()->can('view', News::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $newsId = $request->query('newsId');
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

        $operator = $request->query('operator', 'and');

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
        try {
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
        } catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
    }

    public function likeNews(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $news = News::findOrFail($id);
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
        } catch (ModelNotFoundException $e) {
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
        try {
            $newStatus = $request->input('status');
            $news = News::findOrFail($id);

            if (!$news) {
                return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
            }

            if (!Auth::user()->can('updateStatus', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to update the status of this news');
            }

            if (!in_array($newStatus, News::STATUSES)) {
                return $this->errorResponse('Invalid status entered', [], 404);
            }

            $news->update(['status' => $newStatus]);

            return $this->successResponse(['news' => $news], 'News status updated successfully', 200);
        } catch (ModelNotFoundException | AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
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
        try {
            $news = News::findOrFail($id);

            if (!Auth::user()->can('update', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to update this news');
            }

            $news->update($request->validated());

            return $this->successResponse(['news' => $news], 'News updated successfully', 200);
        } catch (ModelNotFoundException | AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
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
        try {
            $news = News::findOrFail($id);

            if (!Auth::user()->can('delete', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this news');
            }

            $news->delete();

            return $this->successResponse(['news' => $news], 'News deleted successfully', 200);
        } catch (ModelNotFoundException | AccessDeniedHttpException$e) {
            return $this->handleException($e);
        }
    }
}

