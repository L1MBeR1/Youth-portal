<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use App\Http\Requests\SetContentStatusRequest;
use Symfony\Component\HttpFoundation\Response;

use App\Services\FileService;


class BlogController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;

    /**
     * Get blog by id
     * 
     * 
     * 
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
     * Поиск
     * 
     * Получение списка блогов
     * 
     * @group Блоги
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

        $blogs = Blog::where('author_id', $user->id)->paginate($request->get('per_page', 10));
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

        Log::info($request->input("description"));

        $blog = Blog::create($request->validated() + [
            'status' => 'unsaved',
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


    public function createDraft($blogId)
    {
        if (Blog::where('draft_for', $blogId)->exists()) {
            return $this->errorResponse('Черновик уже существует', [], Response::HTTP_CONFLICT);
        }

        $blog = Blog::find($blogId);
        $blogData = $blog->toArray();

        unset($blogData['id'], $blogData['draft_for']);
        $blogData['draft_for'] = $blog->id;

        // Поле описания должно быть массивом
        if (is_string($blogData['description'])) {
            $blogData['description'] = json_decode($blogData['description'], true);
        }

        $draft = Blog::create($blogData);

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
        unset($draftData['id'], $draftData['draft_for'], $draftData['created_at'], $draftData['updated_at']);

        // Обновляем блог полями черновика
        $blogToReplace->update($draftData);

        $draft->delete();

        return $this->successResponse(['blog' => $blogToReplace], 'Блог успешно обновлен черновиком', Response::HTTP_OK);
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

        $like = $blog->likes()->where('user_id', $user->id)->first();

        if ($like) {
            $like->delete();
            $blog->decrement('likes');
            return $this->successResponse(['blogs' => $blog], 'Лайк на блог успешно отменен', 200);
        } else {
            $blog->likes()->create(['user_id' => $user->id]);
            $blog->increment('likes');
        }

        return $this->successResponse(['blogs' => $blog], 'Блог успешно лайкнут', 200);
    }



    public function getTags()
    {
        $tags = Blog::select(DB::raw("DISTINCT(description->'meta'->>'tags') as tags"))
            ->pluck('tags');

        return response()->json($tags);
    }
}
