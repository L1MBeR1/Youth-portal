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
     * Получить все блоги с информацией об авторах.
     */
    public function index()
    {
        $blog = Blog::join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
            ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->get();

        return response()->json($blog);
    }

    /** 
     * @group Блоги
     * 
     * Получить блоги
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * 
     * 
     */
    public function listBlogs(Request $request)
    {
        // TODO: добавить имя автора
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
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
        } else {

            return $this->successResponse(Blog::all(), '', 200);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {
    //     //
    // }

    /**
     * @group Блоги
     * Создать
     * @authenticated
     * 
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
     * Display the specified resource.
     */
    // public function show(Blog $blog)
    // {
    //     //
    // }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(Blog $blog)
    // {
    //     //
    // }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        if (!Auth::user()->can('update', Blog::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $blog = Blog::find($id);

        if (!$blog) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
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
     * Remove the specified resource from storage.
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
