<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreBlogRequest;
use App\Http\Requests\UpdateBlogRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\QueryBuilderTrait;
use App\Traits\PaginationTrait;
class BlogController extends Controller
{   
    use QueryBuilderTrait, PaginationTrait;
    
    /**
     * Список с авторами
     *
     * @group Блоги
     * @authenticated
     */
    // public function index(Request $request): \Illuminate\Http\JsonResponse
    // {
    //     $perPage = $request->get('per_page', 10);
    //     $blogs = Blog::join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
    //         ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
    //         ->paginate($perPage);

    //     return response()->json($blogs);
    // }



    /**
     * Список
     *
     * Получение списка блогов
     *
     * @group Блоги
     *
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam blogId int ID блога.
     *
     */
    public function listBlogs(Request $request): \Illuminate\Http\JsonResponse
    {
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $blogId = $request->query('blogId');
        $response = [];


        if ($userId) {
            $user = User::find($userId);

            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }

            $response[] = $user->blogs;
            $response[] = $user->metadata;

            return $this->successResponse($response);
        } else if ($currentUser) {
            return $this->successResponse([Auth::user()->blogs, Auth::user()->metadata]);
        } else if ($blogId) {
            return $this->successResponse(Blog::find($blogId));
        } else {

            return $this->successResponse(Blog::all(), '', 200);
        }
    }


    public function getBlogById($id): \Illuminate\Http\JsonResponse
    {
        $blog = Blog::find($id);

        if (!Auth::user()->can('requestSpecificBlog', [Blog::class, $blog])) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        if ($blog) {
            $blog->increment('views');
        }

        return $this->successResponse($blog, '', 200);
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
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
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

        $perPage = $request->get('per_page', 5);
        $this->checkSearchPermissions($request);
        $query = $this->buildPublicationQuery($request, Blog::class, 'blogs');

        $blogs = $query->paginate($perPage);
        $paginationData = $this->formPagination($blogs);
        return $this->successResponse($blogs->items(), $paginationData, 200);
    }


    private function checkSearchPermissions(Request $request)
    {
        if ($request->hasAny(['status', 'searchColumnName', 'searchValue', 'searchFields', 'searchValues'])) {
            if (!Auth::user()->can('search', Blog::class)) {
                $this->errorResponse('Нет прав на просмотр', [], 403);
            }
        }
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

        $query = Blog::where('author_id', $user->id);

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');
        $blogStatus = $request->query('status');

        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at', 'status', 'title'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        }

        if ($blogStatus) {
            $query->where('status', $blogStatus);
        }

        $perPage = $request->query('perPage');
        $blogs = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($blogs);
        return $this->successResponse($blogs->items(), $paginationData, 200);
    }






    /**
     * Список опубликованных блогов
     *
     * Описание
     *
     * @group Блоги
     *
     * @authenticated
     *
     * @urlParam orderBy string Сортировка (Столбец)
     * @urlParam orderDir string Сортировка (Направление "asc", "desc")
     * @urlParam userId int ID пользователя. 
     *
     */
    public function getPublishedBlogs(Request $request)
    {
        if (!Auth::user()->can('viewPublishedBlogs', Blog::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $query = Blog::where('status', 'published');
        $query->leftJoin('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id');
        $query->select(
            'blogs.id',
            'blogs.title',
            'blogs.created_at',
            'blogs.updated_at',
            'blogs.likes',
            'blogs.reposts',
            'blogs.views',
            'user_metadata.nickname',
        );

        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');

        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        } else {
            $query->orderBy('updated_at', 'desc');
        }

        if ($userId = $request->query('userId')) {
            $query->where('blogs.author_id', $userId);
        }

        $perPage = $request->query('perPage');
        $blogs = $query->paginate($perPage ? $perPage : 10);
        $paginationData = $this->formPagination($blogs);
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

        $blog = Blog::create($request->validated() + [
            'status' => 'moderating',
            'author_id' => Auth::id(),
        ]);

        return $this->successResponse(['blog' => $blog], 'Блог успешно создан', 200);
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

        $validatedData = $request->validated();
        $blog->update($validatedData);

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
    public function setStatus(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!Auth::user()->can('changeStatus', $blog)) {
            return $this->errorResponse('Отсутствуют разрешения', [], Response::HTTP_FORBIDDEN);
        }

        if (!$blog) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        $this->validateRequest($request, [
            'status' => 'nullable|string|max:255',
        ]);

        $blog->status = $request->input('status');
        $blog->save();

        return $this->successResponse($blog, 'Запись успешно обновлена', Response::HTTP_OK);
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

        $blog->delete();

        return $this->successResponse([], 'Блог успешно удален');
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
}
