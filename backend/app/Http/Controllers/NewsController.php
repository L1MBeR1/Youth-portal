<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Symfony\Component\HttpFoundation\Response;

class NewsController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;


    /**
     * Summary of getNewsById
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getNewsById($id)
    {
        $news = News::find($id);
    
        if (!$news) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if ($news->status !== 'published') {
            $user = Auth::user();
            // Если не авторизован или нет прав
            if (!$user || !$user->can('requestSpecificBlog', $blog)) {
                return $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }

        $news->increment('views');
        

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

        $user = Auth::user();
        $userId = $user ? $user->id : null;
        $news = $this->connectFields($news->id, $requiredFields, News::class, $userId);
        return $this->successResponse($news, '', 200);
    }


    /**
     * Поиск
     * 
     * Получение списка новостей
     * 
     * @group Новости
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @urlParam page int Номер страницы.
     * @urlParam per_page int Элементов на странице.
     * 
     * 
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
     */
    public function getNews(Request $request)
    {
        if (!Auth::user()->can('viewAny', News::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "news" => [
                "id",
                "title",
                "description",
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

        $query = $this->buildPublicationQuery($request, News::class, $requiredFields);
        $news = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($news);
        return $this->successResponse($news->items(), $paginationData, 200);
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

        $news = News::where('author_id', $user->id)->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($news);
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
        $requiredFields = [
            "news" => [
                "id",
                "title",
                "description",
                "status",
                "created_at",
                "updated_at",
                "likes",
                "reposts",
                "views",
                "cover_uri",
            ],
            "user_metadata" => [
                "nickname",
                "profile_image_uri",
            ]
        ];

        $user = Auth::user();
        $userId = $user ? $user->id : null;
        $query = $this->buildPublicationQuery($request, News::class, $requiredFields, $published=true, $userId);
        $news = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($news);
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

        return $this->successResponse($news, 'Новость успешно создана', 200);
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
     * Обновить статус
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

