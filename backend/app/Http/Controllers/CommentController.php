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
    public function store(Request $request, $resource_type, $resource_id)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        // Получаем текущего пользователя
        $user = Auth::user();

        // Проверяем, имеет ли пользователь право создавать комментарий
        if (!$user->can('createComment', [Comment::class, $resource_type, $resource_id])) {
            return response()->json(['message' => 'You do not have permission to create this comment'], 403);
        }

        $input = $request->all();
        $comment = Comment::createComment($input, $resource_type, $resource_id);

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
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
    public function update(Request $request, $id)
    {
        Log::info('Request data:', $request->all()); // Логирование всех данных запроса

        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'You do not have permission to edit this comment'], 403);
        }

        $request->validate([
            'content' => 'required|string',
        ]);
        Log::info('$request->content');
        $comment->updateComment($request->content);
        

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment], 200);
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
