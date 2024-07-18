<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class BlogController extends Controller
{
    /**
     * Список с авторами
     * 
     * @group Блоги
     * @authenticated
     */
    public function index(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $blogs = Blog::join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
            ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->paginate($perPage);

        return response()->json($blogs);
    }

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
    public function listBlogs(Request $request)
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


    /**
     * Список (новый)
     * 
     * Получение списка блогов (новый. использовать этот метод)
     * 
     * @group Блоги
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam blogId int ID блога.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crDateFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam crDateTo string Дата окончания (формат: Y-m-d H:i:s).
     * @urlParam updDateFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam updDateTo string Дата окончания (формат: Y-m-d H:i:s).
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getBlogs(Request $request)
    {
        if (!Auth::user()->can('view', Blog::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $blogId = $request->query('blogId');
        $withAuthors = $request->query('withAuthors', false);
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $tagFilter = $request->query('tagFilter');
        $crDateFrom = $request->query('crDateFrom');
        $crDateTo = $request->query('crDateTo');
        $updDateFrom = $request->query('updDateFrom');
        $updDateTo = $request->query('updDateTo');

        $query = Blog::query();

        if ($withAuthors) {
            $query->join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
                ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
        } elseif ($blogId) {
            $query->where('id', $blogId);
        }

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if ($tagFilter) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }

        if ($crDateFrom && $crDateTo) {
            $query->whereBetween('created_at', [$crDateFrom, $crDateTo]);
        } elseif ($crDateFrom) {
            $query->where('created_at', '>=', $crDateFrom);
        } elseif ($crDateTo) {
            $query->where('created_at', '<=', $crDateTo);
        }

        if ($updDateFrom && $updDateTo) {
            $query->whereBetween('updated_at', [$updDateFrom, $updDateTo]);
        } elseif ($updDateFrom) {
            $query->where('updated_at', '>=', $updDateFrom);
        } elseif ($updDateTo) {
            $query->where('updated_at', '<=', $updDateTo);
        }

        $blogs = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $blogs->currentPage(),
            'from' => $blogs->firstItem(),
            'last_page' => $blogs->lastPage(),
            'per_page' => $blogs->perPage(),
            'to' => $blogs->lastItem(),
            'total' => $blogs->total(),
        ];

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
    public function store(Request $request)
    {
        if (!Auth::user()->can('create')) {
            return $this->errorResponse('Нет прав', [], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'cover_uri' => 'nullable|string',
            'status' => 'nullable|string|max:255',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'reposts' => 'nullable|integer',
        ]);

        $input = $request->all();
        $input['status'] = 'moderating';

        // Создаем новый блог
        $blog = new Blog($input);
        $blog->author_id = Auth::id(); // Устанавливаем автора блога как текущего пользователя

        $blog->save();

        return response()->json(['message' => 'Blog created successfully', 'blog' => $blog], 201);
    }



    /**
     * Обновить
     * 
     * @authenticated
     * @group Блоги
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::find($id);



        if (!$blog) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $blog)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $this->validateRequest($request, [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'content' => 'nullable|string',
            'cover_uri' => 'nullable|string',
            'status' => 'nullable|string|max:255',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'reposts' => 'nullable|integer',
        ]);

        $updateData = $request->only([
            'title',
            'description',
            'content',
            'cover_uri',
            'status',
            'views',
            'likes',
            'reposts',
        ]);



        $blog->update($updateData);

        return $this->successResponse($blog, 'Запись успешно обновлена', Response::HTTP_OK);
    }

    /**
     * Сменить статус
     * 
     * @group Блоги
     * @authenticated
     * 
     * 
     */
    public function setStatus(Request $request, $id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('changeStatus', $blog)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $this->validateRequest($request, [
            'status' => 'nullable|string|max:255',
        ]);

        $updateData = $request->only([
            'status',
        ]);

        $blog->update($updateData);

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

        if (!$blog) {
            return $this->errorResponse('Блог не найден', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('delete', $blog)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }



        $blog->delete();

        return $this->successResponse(null, 'Запись удалена', Response::HTTP_OK);
    }
}
