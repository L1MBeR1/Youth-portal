<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\CommentToResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
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
    public function getForContent(int $id, string $type): \Illuminate\Http\JsonResponse
    {
        $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
            ->join('comment_to_resource', 'comments.id', '=', 'comment_to_resource.comment_id')
            ->select('comments.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname', 'user_metadata.profile_image_uri', 'comment_to_resource.reply_to')
            ->where('comment_to_resource.' . $type . '_id', '=', $id)
            ->get();
        return $this->successResponse($comments);
    }



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
        try {
            // Получаем текущего пользователя
            $user = Auth::user();

            // Проверяем, имеет ли пользователь право создавать комментарий
            if (!$user->can('createComment', [Comment::class, $resource_type, $resource_id])) {
                throw new AccessDeniedHttpException('You do not have permission to create this comment');
            }

            // Валидация данных запроса с использованием validateRequest
            $this->validateRequest($request, $request->rules());

            // Создаем комментарий на основе проверенных данных
            $comment = Comment::createComment($request->validated(), $resource_type, $resource_id);

            // Возвращаем успешный ответ JSON
            return $this->successResponse(['comment' => $comment], 'Comment created successfully', 200);

        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
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
        try {
            // Найти комментарий по идентификатору
            $comment = Comment::find($id);

            if (!$comment) {
                throw new NotFoundHttpException('Comment not found');
            }

            // Проверка прав пользователя на обновление комментария
            if (!Auth::user()->can('update', $comment)) {
                throw new AccessDeniedHttpException('You do not have permission to update this comment');
            }

            // Валидация данных запроса с использованием метода validateRequest
            $this->validateRequest($request, $request->rules());

            // Обновление комментария с использованием проверенных данных
            $comment->content = $request->validated();
            $comment->save();

            // Возвращаем успешный ответ JSON
            return $this->successResponse(['comment' => $comment], 'Comment updated successfully', 200);
        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
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
        try {
            $comment = Comment::find($id);

            if (!$comment) {
                throw new NotFoundHttpException('Comment not found');
            }

            // Проверка прав доступа через политику
            if (!Auth::user()->can('delete', $comment)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this comment');
            }

            $comment->delete();

            return $this->successResponse(['comment' => $comment], 'Comment deleted successfully', 200);
        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }
}
