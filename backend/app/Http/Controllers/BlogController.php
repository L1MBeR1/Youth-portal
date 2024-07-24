<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
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
    public function getBlogs(Request $request)
    {//TODO: Переделать
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
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');

        $updDate = $request->query('updDate');
        $crtDate = $request->query('crtDate');
        
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

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
            $blog = $query->first(); 
            if ($blog) {
                $blog->increment('views'); 
            }
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
     * @bodyParam status string Новый статус
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

    /**
     * Лайкнуть блог
     * 
     * Этот метод позволяет пользователю "лайкнуть" или "дизлайкнуть" блог.
     * 
     * @group    Блоги
     * 
     * @urlParam id int Обязательно. Идентификатор блога.
     * 
     */
    public function likeBlog(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $blog = Blog::findOrFail($id);
            $user = Auth::user();

            $like = $blog->likes()->where('user_id', $user->id)->first();

            if ($like) {
                $like->delete();
                $blog->decrement('likes');
                return $this->successResponse(['blogs' => $blog], 'Blog unliked successfully', 200);
            } else {
                $blog->likes()->create(['user_id' => $user->id]);
                $blog->increment('likes');
            }

            return $this->successResponse(['blogs' => $blog], 'Blog liked successfully', 200);
        } catch (ModelNotFoundException $e) {
            return $this->handleException($e);
        }
    }
}
