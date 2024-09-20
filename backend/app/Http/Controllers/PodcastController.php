<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use Illuminate\Http\Request;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait; 
// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePodcastRequest;
use App\Http\Requests\UpdatePodcastRequest;
use Symfony\Component\HttpFoundation\Response;

class PodcastController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;


    /**
     * Summary of getPodcastById
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getPodcastById($id)
    {
        $podcast = Podcast::find($id);

        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!$podcast->status === 'published') {
            $user = Auth::user();
            // Если не авторизован или нет прав
            if (!Auth::user()->can('requestSpecificPodcast', [Podcast::class, $podcast])) {
                return $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }

        $podcast->increment('views');
        
        $requiredFields = [
            "podcasts" => [
                "id",
                "title",
                "description",
                "audio_uri",
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

        $user = Auth::user();
        $userId = $user ? $user->id : null;
        $podcast = $this->connectFields($podcast->id, $requiredFields, Podcast::class, $userId);
        return $this->successResponse($podcast, '', 200);
    }


    /**
     * Поиск
     * 
     * Получение списка подкастов
     * 
     * @group Подкасты
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @urlParam page int Номер страницы.
     * @urlParam per_page int Элементов на странице.
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
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getPodcasts(Request $request)
    {
        if (!Auth::user()->can('viewAny', Podcast::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "podcasts" => [
                "id",
                "title",
                "description",
                "audio_uri",
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

        $query = $this->buildPublicationQuery($request, Podcast::class, $requiredFields);
        $podcasts = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($podcasts);
        return $this->successResponse($podcasts->items(), $paginationData, 200);
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

        $podcasts = Podcast::where('author_id', $user->id)->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($podcasts);
        return $this->successResponse($podcasts->items(), $paginationData, 200);
    }

    public function getTags(Request $request)
    {
        //TODO: Переписать когда будет нормальный трейт для фильтров
        // Получение параметров из запроса
        $publishedOnly = $request->query('publishedOnly', false);
        $authorId = $request->query('authorId', null);

        // Создаем запрос к базе данных
        $query = Podcast::query();

        // Фильтрация по статусу публикации, если установлен параметр publishedOnly
        if ($publishedOnly) {
            $query->where('status', 'published');
        }

        // Фильтрация по authorId, если установлен параметр authorId
        if ($authorId) {
            $query->where('author_id', $authorId);
        }

        // Получаем список тегов, используя jsonb_array_elements_text для извлечения отдельных значений массива
        $tags = $query->select(DB::raw("jsonb_array_elements_text(description->'meta'->'tags') as tag"))
            ->distinct()
            ->pluck('tag');

        $message = count($tags) > 0 ? 'Success' : 'No tags found';
        return $this->successResponse(
            data: $tags,
            message: $message
        );
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
        $requiredFields = [
            "podcasts" => [
                "id",
                "title",
                "description",
                "audio_uri",
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
        $query = $this->buildPublicationQuery($request, Podcast::class, $requiredFields, $published=true, $userId);
        $podcasts = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($podcasts);
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

        $podcast->update($request->validated());
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
     * @group Подкасты
     * 
     * @urlParam id int Обязательно. Идентификатор подкаста.
     * 
     */
    public function likePodcast(Request $request, int $id): \Illuminate\Http\JsonResponse
    {
        $podcast = Podcast::find($id);
        if (!$podcast) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }
        $user = Auth::user();

        if (!Auth::user()->can('setLikes', $podcast)) {
            return $this->errorResponse('Нет прав на лайки', [], Response::HTTP_FORBIDDEN);
        }

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
