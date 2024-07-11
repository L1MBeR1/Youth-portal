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
     * Получить блоги на основе предоставленных параметров запроса.
     */
    public function listBlogs(Request $request)
    {
        // Параметры запроса: userId, currentUser
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');

        if ($userId) {
            $user = User::find($userId);

            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }

            return $this->successResponse($user->blogs);
        } else if ($currentUser) {
            return $this->successResponse(Auth::user()->blogs);
        } else {
            return $this->successResponse(Blog::all(), '', 200);
        }
    }


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
        Log::info($input);
        $input['status'] = 'moderating';
        Log::info('awdaw', $input);

        // Создаем новый блог
        $blog = new Blog($input);
        $blog->author_id = Auth::id(); // Устанавливаем автора блога как текущего пользователя

        $blog->save();

        return response()->json(['message' => 'Blog created successfully', 'blog' => $blog], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        if (!$user->hasPermissionTo('edit own news')) {
            return $this->errorResponse('r', [], 403);
        }

        $blogs = Blog::find($id);

        if (!$blogs) {
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

        // Фильтрация только тех полей, которые были переданы в запросе
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

        // Обновление данных новости
        $blogs->update($updateData);

        return $this->successResponse($blogs, 'Запись успешно обновлена', Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $blog = Blog::find($id);

        if (!$blog) {
            return response()->json(['error' => 'Blog not found'], Response::HTTP_NOT_FOUND);
        }

        $blog->delete();

        return response()->json(['success' => 'Blog successfully deleted'], Response::HTTP_OK);
    }
}
