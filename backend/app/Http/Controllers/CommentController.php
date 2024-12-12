<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Comment;
use App\Models\User;
use App\Models\Blog;
use App\Models\News;
use App\Models\Podcast;
use Illuminate\Http\Request;
use App\Models\CommentToResource;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;



class CommentController extends Controller
{

    /**
     * Список
     * 
     * Получить всё комментарии
     *
     * @group Комментарии
     * 
     * @authenticated 
     * 
     * @return \Illuminate\Http\JsonResponse 
     */
    public function index()
    {
        $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
            ->select(
                'comments.*',
                'user_metadata.first_name',
                'user_metadata.last_name',
                'user_metadata.patronymic',
                'user_metadata.nickname'
            )
            ->get();
        return response()->json($comments);
    }



    /**
     * Найти
     * 
     * Получите комментарии для конкретного элемента контента.
     * 
     * @group Комментарии
     * 
     * @authenticated
     *
     * @param int $id The ID of the content item.
     * @param string $type The type of the content item.
     * @return \Illuminate\Http\JsonResponse The comments for the content item.
     */
    public function getForContent(string $type, int $id): \Illuminate\Http\JsonResponse
    {
        $resource = $this->getResourceByType($type, $id);

        if (!$resource) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        $user = Auth::user();

        // Проверка разрешений
        $permissionError = $this->checkPermissions($user, $resource, $type);
        if ($permissionError) {
            return $permissionError;
        }

        // Запрос
        $comments = $this->fetchComments($type, $id, $user);

        return $this->successResponse($comments);
    }

    private function getResourceByType(string $type, int $id)
    {
        switch ($type) {
            case 'blog':
                return Blog::find($id);
            case 'podcast':
                return Podcast::find($id);
            case 'news':
                return News::find($id);
            default:
                return null;
        }
    }

    private function checkPermissions($user, $resource, string $type)
    {
        if ($resource->status !== 'published') {
            if (!$user) {
                return $this->errorResponse('Доступ запрещен', [], Response::HTTP_FORBIDDEN);
            }
            if ($user->id !== $resource->author_id && !$user->hasRole('admin|moderator|su')) {
                return $this->errorResponse('Доступ запрещен', [], Response::HTTP_FORBIDDEN);
            }
        }
        return null;
    }

    private function fetchComments(string $type, int $id, $user)
    {
        if ($user) {
            return $this->getCommentsWithLikes($type, $id);
        } else {
            return Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
                ->join('comment_to_resource', 'comments.id', '=', 'comment_to_resource.comment_id')
                ->select('comments.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname', 'user_metadata.profile_image_uri', 'comment_to_resource.reply_to')
                ->where('comment_to_resource.' . $type . '_id', '=', $id)
                ->distinct()
                ->get();
        }
    }


    private function getCommentsWithLikes(string $type, int $id)
    {
        $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
            ->join('comment_to_resource', 'comments.id', '=', 'comment_to_resource.comment_id')
            ->leftJoin('likes', function ($join) {
                $join->on('comments.id', '=', 'likes.likeable_id')
                    ->where('likes.likeable_type', '=', 'comment');
            })
            ->select(
                'comments.*',
                'user_metadata.first_name',
                'user_metadata.last_name',
                'user_metadata.patronymic',
                'user_metadata.nickname',
                'user_metadata.profile_image_uri',
                'comment_to_resource.reply_to',
                DB::raw('COUNT(likes.id) > 0 as is_liked')
            )
            ->where('comment_to_resource.' . $type . '_id', '=', $id)
            ->groupBy(
                'comments.id',
                'user_metadata.first_name',
                'user_metadata.last_name',
                'user_metadata.patronymic',
                'user_metadata.nickname',
                'user_metadata.profile_image_uri',
                'comment_to_resource.reply_to'
            )
            ->get();

        return $comments;
    }



    public function like($commentId)
    {
        $comment = Comment::find($commentId);

        $user = Auth::user();

        if (!$user->can('set likes', $comment)) {
            return $this->errorResponse('Нет прав на лайки', [], Response::HTTP_FORBIDDEN);
        }

        $isAlreadyLiked = DB::table('likes')->where('likeable_id', $commentId)->where('likeable_type', 'comment')->where('user_id', Auth::id())->first();
        if ($isAlreadyLiked) {
            $like = DB::table('likes')
                ->where('likeable_id', $commentId)
                ->where('likeable_type', 'comment')
                ->where('user_id', Auth::id())
                ->first();
            $comment->decrement('likes');
            DB::table('likes')->where('id', $like->id)->delete();
            return $this->successResponse([], 'unliked');
        }

        $comment->increment('likes');
        DB::table('likes')->insert([
            'user_id' => Auth::user()->id,
            'likeable_id' => $commentId,
            'likeable_type' => 'comment'
        ]);
        return $this->successResponse([], 'liked');
    }

    // public function dislike($commentId)
    // {
    //     $comment = Comment::find($commentId);
    //     $comment->decrement('likes');

    //     $isAlreadyLiked = DB::table('likes')->where('likeable_id', $commentId)->where('likeable_type', 'comment')->where('user_id', Auth::id())->first();
    //     if (!$isAlreadyLiked) {
    //         return $this->errorResponse('You did not liked this comment', [], 400);
    //     }

    //     $like = DB::table('likes')
    //         ->where('likeable_id', $commentId)
    //         ->where('likeable_type', 'comment')
    //         ->where('user_id', Auth::id())
    //         ->first();

    //     DB::table('likes')->where('id', $like->id)->delete();

    //     return $this->successResponse([], 'unliked');
    // }


    /**
     * Создать
     * 
     * Создать новый комментарий.
     * 
     * @group Комментарии
     * 
     * @authenticated
     */
    public function store(StoreCommentRequest $request, $resource_type, $resource_id)
    {
        $user = Auth::user();

        if (!$user->can('createComment', [Comment::class, $resource_type, $resource_id])) {
            return $this->errorResponse('Нет прав на создание комментария', [], 403);
        }

        $comment = Comment::createComment($request->validated(), $resource_type, $resource_id);

        if (!$comment) {
            return $this->errorResponse('Ваш комментарий содержит недопустимые слова', [], 400);
        }

        return $this->successResponse(['comment' => $comment], 'Коммент создан успешно', 200);
    }



    /**
     * Обновить
     * 
     * Обновить комментарий.
     * 
     * @group Комментарии
     * 
     * @authenticated
     */
    public function update(UpdateCommentRequest $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Комментарий не найден', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $comment)) {
            return $this->errorResponse('Нет прав на обновление комментария', [], 403);
        }

        $comment->content = $request->validated()['content'];
        $comment->save();

        return $this->successResponse(['comment' => $comment], 'Комментарий обновлен успешно', 200);
    }



    /**
     * Удалить
     * 
     * Удалить комментарий.
     * 
     * @group Комментарии
     * 
     * @authenticated
     */
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        // Проверка прав доступа через политику
        if (!Auth::user()->can('delete', $comment)) {
            return $this->errorResponse('Нет прав на удаление комментариев', [], 403);
        }

        $comment->delete();

        return $this->successResponse(['comment' => $comment], 'Комментарий удален успешно', 200);
    }
}
