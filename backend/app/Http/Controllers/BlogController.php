<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Services\PopularityCalculator;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Requests\SetContentStatusRequest;
use Symfony\Component\HttpFoundation\Response;

use App\Services\FileService;


class BlogController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;

    /**
     * @OA\Get(
     *      path="/api/blogs/{id}",
     *      operationId="getBlogById",
     *      tags={"Blogs"},
     *      summary="Получить блог по ID",
     *      description="Возвращает блог по требуемому ID",
     *      @OA\Parameter(
     *          name="id",
     *          description="ID блога",
     *          required=true,
     *          in="path",
     *          @OA\Schema(type="integer")
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *           response=404,
     *           description="Not found"
     *      )
     *     )
     */
    public function getBlogById($id): \Illuminate\Http\JsonResponse
    {
        $blog = Blog::find($id);
        $user = null;

        if (!$blog) {
            return $this->errorResponse(message: 'Блог не найден', status: Response::HTTP_NOT_FOUND);
        }

        if ($blog->status !== 'published') {
            $user = Auth::user();
            // Если не авторизован или нет прав
            if (!$user || !$user->can('requestSpecificBlog', $blog)) {
                return $this->errorResponse(message: 'Нет прав на просмотр', status: 403);
            }
        }

        $blog->increment('views');

        $requiredFields = [
            "blogs" => [
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
        $blog = $this->connectFields($blog->id, $requiredFields, Blog::class, $userId);
        return $this->successResponse(data: $blog);
    }


    /**
     * @OA\Get(
     *     path="/api/blogs/",
     *     summary="Поиск блогов",
     *     description="Получение списка блогов с фильтрацией и пагинацией",
     *     tags={"Blogs"},
     *     security={{"bearerAuth":{}}},
     *     
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Номер страницы",
     *         required=false,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         description="Количество элементов на странице",
     *         required=false,
     *         @OA\Schema(type="integer", example=10)
     *     ),
     *     @OA\Parameter(
     *         name="searchFields",
     *         in="query",
     *         description="Массив столбцов для поиска",
     *         required=false,
     *         @OA\Schema(type="array", @OA\Items(type="string"), example={"title", "content"})
     *     ),
     *     @OA\Parameter(
     *         name="searchValues",
     *         in="query",
     *         description="Массив значений для поиска",
     *         required=false,
     *         @OA\Schema(type="array", @OA\Items(type="string"), example={"Laravel", "Swagger"})
     *     ),
     *     @OA\Parameter(
     *         name="tagFilter",
     *         in="query",
     *         description="Фильтр по тегу в meta описания",
     *         required=false,
     *         @OA\Schema(type="string", example="tech")
     *     ),
     *     @OA\Parameter(
     *         name="crtFrom",
     *         in="query",
     *         description="Дата начала (формат: Y-m-d H:i:s или Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-01-01")
     *     ),
     *     @OA\Parameter(
     *         name="crtTo",
     *         in="query",
     *         description="Дата окончания (формат: Y-m-d H:i:s или Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-12-31")
     *     ),
     *     @OA\Parameter(
     *         name="crtDate",
     *         in="query",
     *         description="Дата создания (формат: Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-06-01")
     *     ),
     *     @OA\Parameter(
     *         name="updFrom",
     *         in="query",
     *         description="Дата начала обновления (формат: Y-m-d H:i:s или Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-01-01")
     *     ),
     *     @OA\Parameter(
     *         name="updTo",
     *         in="query",
     *         description="Дата окончания обновления (формат: Y-m-d H:i:s или Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-12-31")
     *     ),
     *     @OA\Parameter(
     *         name="updDate",
     *         in="query",
     *         description="Дата обновления (формат: Y-m-d)",
     *         required=false,
     *         @OA\Schema(type="string", format="date", example="2023-06-01")
     *     ),
     *     @OA\Parameter(
     *         name="operator",
     *         in="query",
     *         description="Логический оператор для условий поиска ('and' или 'or')",
     *         required=false,
     *         @OA\Schema(type="string", enum={"and", "or"}, example="and")
     *     ),
     *     @OA\Parameter(
     *         description="Фильтрация по пользователю",
     *         required=false,
     *          in="query",
     *         name="authorId",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *      @OA\Parameter(
     *         description="Результат для текущего (авторизованного) пользователя",
     *         required=false,
     *          in="query",
     *         name="currentUser",
     *         @OA\Schema(type="boolean", example=true)
     *     ),
     *     
     *     @OA\Response(
     *         response=200,
     *         description="Успешный поиск",
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Неавторизован"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Блоги не найдены"
     *     )
     * )
     */
    public function getBlogs(Request $request)
    {
        if (!Auth::user()->can('viewAny', Blog::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "blogs" => [
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

        $query = $this->buildPublicationQuery($request, Blog::class, $requiredFields);
        $blogs = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($blogs);
        return $this->successResponse($blogs->items(), $paginationData, 200);
    }



    /**
     * Мои блоги
     *
     * Получение списка блогов для текущего пользователя
     *
     * @group Блоги
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
    public function getOwnBlogs(Request $request)
    {
        $user = Auth::user();

        if (!$user->can('viewOwnBlogs', Blog::class)) {
            return $this->errorResponse('You do not have permission to view your own blogs.', [], 403);
        }

        $query = Blog::query();

        $query->where('author_id', $user->id);

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at', 'status', 'title'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $blogs = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($blogs);

        return $this->successResponse($blogs->items(), $paginationData, 200);
    }







    /**
     * Список опубликованных блогов
     *
     * Описание
     *
     * @group Блоги
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam userId int ID пользователя. 
     *
     */
    public function getPublishedBlogs(Request $request)
    {
        $requiredFields = [
            "blogs" => [
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


        $userId = Auth::user()?->id;
        $query = $this->buildPublicationQuery($request, Blog::class, $requiredFields, true, $userId);
        $blogs = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($blogs);
        return $this->successResponse($blogs->items(), $paginationData, 200);
    }


    /**
     * Создать
     *
     * Создание нового блога
     *
     * @group Блоги
     * @authenticated
     *
     */
    public function store(StoreBlogRequest $request)
    {
        if (!Auth::user()->can('create', Blog::class)) {
            return $this->errorResponse('Нет прав на создание блога', [], 403);
        }

        // Log::info($request->input("description"));

        $blog = Blog::create($request->validated() + [
            'status' => 'moderating',
            'author_id' => Auth::id(),
        ]);

        return $this->successResponse($blog, 'Блог успешно создан', 200);
    }



    /**
     * Обновить
     *
     * @authenticated
     * @group Блоги
     *
     * @bodyParam title string Название.
     * @bodyParam description string Описание.
     * @bodyParam content string Содержание.
     * @bodyParam cover_uri string URI обложки.
     * @bodyParam status string Статус.
     * @bodyParam views int Количество просмотров.
     * @bodyParam likes int Количество лайков.
     * @bodyParam reposts int Количество репостов.
     * 
     */
    public function update(UpdateBlogRequest $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return $this->errorResponse('Блог не найден', [], Response::HTTP_NOT_FOUND);
        }

        if ($blog->status === "published") {
            return $this->errorResponse('Нельзя редактировать опубликованный блог', [], Response::HTTP_FORBIDDEN);
        }

        if (!Auth::user()->can('update', $blog)) {
            return $this->errorResponse('Нет прав на обновление блога', [], 403);
        }

        $blog->update($request->validated());
        return $this->successResponse(['blog' => $blog], 'Блог успешно обновлен', 200);
    }




    /**
     * Сменить статус
     *
     * @group Блоги
     * @authenticated
     *
     * @bodyParam status string Новый статус
     *
     */
    public function setStatus(SetContentStatusRequest $request, $id)
    {
        $blog = Blog::find($id);

        if (!Auth::user()->can('changeStatus', $blog)) {
            return $this->errorResponse('Отсутствуют разрешения', [], Response::HTTP_FORBIDDEN);
        }

        if (!$blog) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }
        $request->validated();

        $blog->status = $request->input('status');
        $blog->save();

        return $this->successResponse($blog, 'Запись успешно обновлена', Response::HTTP_OK);
    }


    public function createDraft($id)
    {
        if (Blog::where('draft_for', $id)->exists()) {
            return $this->errorResponse('Черновик уже существует', [], Response::HTTP_CONFLICT);
        }

        $blog = Blog::find($id);
        $blogData = $blog->toArray();

        unset($blogData['id'], $blogData['draft_for'], $blogData['updated_at']);
        $blogData['draft_for'] = $blog->id;
        // $blogData['status'] = "moderating";

        // dump($blog->author_id);   

        // Поле описания должно быть массивом
        if (is_string($blogData['description'])) {
            $blogData['description'] = json_decode($blogData['description'], true);
        }

        $draft = Blog::create($blogData);
        // dd($blogData);

        // Копировать файлы для черновика
        $fileService = new FileService();
        $fileService->copyFolder('media/blogs/' . $blog->id, 'media/blogs/' . $draft->id);

        return $this->successResponse($draft, 'Черновик создан', Response::HTTP_OK);
    }





    public function applyDraft($draftId)
    {
        $fileService = new FileService();

        // Получаем черновик по ID
        $draft = Blog::find($draftId);
        if (!$draft) {
            return $this->errorResponse('Черновик не найден', [], Response::HTTP_NOT_FOUND);
        }

        // Получаем блог, который нужно заменить, по ID черновика
        $blogToReplace = Blog::find($draft->draft_for);
        if (!$blogToReplace) {
            return $this->errorResponse('Блог для замены не найден', [], Response::HTTP_NOT_FOUND);
        }

        // Удаляем папку, связанную с черновиком
        $folder = 'media/blogs/' . $draft->id;
        $fileService->deleteFolder($folder);

        // Преобразуем черновик в массив и удаляем ненужные поля
        $draftData = $draft->toArray();
        unset($draftData['id'], $draftData['draft_for'], $draftData['created_at'], $draftData['updated_at'], $draftData['author_id']);

        // Обновляем блог полями черновика
        $blogToReplace->update($draftData);

        $draft->delete();

        return $this->successResponse($blogToReplace, 'Блог успешно обновлен черновиком', Response::HTTP_OK);
    }


    /**
     * Удалить
     *
     * @group Блоги
     * @authenticated
     *
     */
    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!Auth::user()->can('delete', $blog)) {
            return $this->errorResponse('Нет прав на удаление блога', [], 403);
        }

        if (!$blog) {
            return $this->errorResponse('Блог не найден', [], 404);
        }

        $res = $blog->delete();
        if ($res) {
            return $this->successResponse([], 'Блог успешно удален');
        }
        return $this->errorResponse('Не удалось удалить блог', [], 500);
    }

    /**
     * Лайкнуть блог
     *
     * Этот метод позволяет пользователю "лайкнуть" или "дизлайкнуть" блог.
     *
     * @group Блоги
     *
     * @urlParam id int Обязательно. Идентификатор блога.
     *
     */
    public function likeBlog(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return $this->errorResponse('Блог не найден', [], Response::HTTP_NOT_FOUND);
        }

        $user = Auth::user();

        if (!$user) {
            return $this->errorResponse('Пользователь не авторизован', [], Response::HTTP_FORBIDDEN);
        }

        if (!Auth::user()->can('setLikes', $blog)) {
            return $this->errorResponse('Нет прав на лайки', [], Response::HTTP_FORBIDDEN);
        }

        $like = $blog->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $blog->decrement('likes');
            return $this->successResponse($blog, 'Лайк на блог успешно отменен');
        } else {
            $blog->likes()->create(['user_id' => $user->id]);
            $blog->increment('likes');
        }

        return $this->successResponse($blog, 'Блог успешно лайкнут');
    }



    public function getTags(Request $request)
    {
        //TODO: Переписать когда будет нормальный трейт для фильтров
        // Получение параметров из запроса
        $publishedOnly = $request->query('publishedOnly', false);
        $authorId = $request->query('authorId', null);

        // Создаем запрос к базе данных
        $query = Blog::query();

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

    protected $popularityCalculator;
    public function __construct(PopularityCalculator $popularityCalculator)
    {
        $this->popularityCalculator = $popularityCalculator;
    }

    public function getPopularBlogs(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $currentPage = $request->input('page', 1);
        $paginatedData = $this->popularityCalculator->getPopularContent('blogs', $perPage, $currentPage);

        if ($paginatedData === null) {
            return $this->errorResponse('Нет популярных блогов', [], 404);
        }

        $paginationData = $this->makePaginationData($paginatedData);

        return $this->successResponse($paginatedData->items(), $paginationData, 200);
    }

    public function getPopularBlogsByTime(Request $request)
    {
        $limit = $request->get('limit', 1);
        $popularBlogs = $this->popularityCalculator->getPopularContentByTime('podcasts', $limit);

        if ($popularBlogs === null) {
            return $this->errorResponse('Нет популярных блогов за установленный промежуток', [], 404);
        }
        return $this->successResponse($popularBlogs, 200);
    }
}
