<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\CommentToResource;
use Illuminate\Support\Facades\Log;


class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
                ->select('comments.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
                ->get();
        return response()->json($comments);
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
    public function store(StoreCommentRequest $request, $resource_type, $resource_id)
    {
        // Получаем текущего пользователя
        $user = Auth::user();

        // Проверяем, имеет ли пользователь право создавать комментарий
        if (!$user->can('createComment', [Comment::class, $resource_type, $resource_id])) {
            return $this->errorResponse('You do not have permission to create this comment', [], 403);
        }

        // Валидация данных запроса
        $this->validateRequest($request, [
            'content' => 'required|string',
        ]);

        // Создаем комментарий на основе проверенных данных
        $comment = Comment::createComment($request->validated(), $resource_type, $resource_id);

        // Возвращаем успешный ответ JSON
        return $this->successResponse(['comment' => $comment], 'Comment created successfully', 201);
    }






    /**
     * Display the specified resource.
     */
    public function show(Comment $comment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Comment $comment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCommentRequest $request, $id)
    {
        // Найти комментарий по идентификатору
        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Comment not found', [], 404);
        }

        // Проверка прав пользователя на обновление комментария
        if (!Auth::user()->can('update', $comment)) {
            return $this->errorResponse('You do not have permission to update this comment', [], 403);
        }

        // Валидация данных запроса с использованием метода validateRequest
        $this->validateRequest($request, [
            'content' => 'required|string',
        ]);

        // Обновление комментария с использованием проверенных данных
        $comment->content = $request->validated();
        $comment->save();

        // Возвращаем успешный ответ JSON
        return $this->successResponse(['comment' => $comment], 'Comment updated successfully', 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }
        // Проверка прав доступа через политику
        if (!Auth::user()->can('delete', $comment)) {
            return response()->json(['message' => 'You do not have permission to delete this comment'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }


}
