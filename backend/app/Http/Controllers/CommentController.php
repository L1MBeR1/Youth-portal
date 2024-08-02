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
    public function getForContent(string $type, int $id): \Illuminate\Http\JsonResponse
    {
        // $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
        //     ->join('comment_to_resource', 'comments.id', '=', 'comment_to_resource.comment_id')
        //     ->select('comments.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname', 'user_metadata.profile_image_uri', 'comment_to_resource.reply_to')
        //     ->where('comment_to_resource.' . $type . '_id', '=', $id)
        //     ->get();
        // return $this->successResponse($comments);


        // TODO: нужна проверка на:
        // 1. Если админ,модератор,су - то вернуть комментарии
        // 2. Если юзер - то вернуть комментарии только для опубликованного материала. Если не опубликован, то 403
        // 3. Если владелец, то вернуть  комментарии

        // Исправлено дублирование
        $comments = Comment::join('user_metadata', 'comments.user_id', '=', 'user_metadata.user_id')
            ->join('comment_to_resource', 'comments.id', '=', 'comment_to_resource.comment_id')
            ->select('comments.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname', 'user_metadata.profile_image_uri', 'comment_to_resource.reply_to')
            ->where('comment_to_resource.' . $type . '_id', '=', $id)
            ->distinct()
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
        // Получаем текущего пользователя
        $user = Auth::user();

        // Проверяем, имеет ли пользователь право создавать комментарий
        if (!$user->can('createComment', [Comment::class, $resource_type, $resource_id])) {
            return $this->errorResponse('Нет прав на создание комментария', [], 403);
        }

        // Создаем комментарий на основе проверенных данных
        $comment = Comment::createComment($request->validated(), $resource_type, $resource_id);

        // Возвращаем успешный ответ JSON
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
        // Найти комментарий по идентификатору
        $comment = Comment::find($id);

        if (!$comment) {
            return $this->errorResponse('Комментарий не найден', [], Response::HTTP_NOT_FOUND);
        }

        // Проверка прав пользователя на обновление комментария
        if (!Auth::user()->can('update', $comment)) {
            return $this->errorResponse('Нет прав на обновление комментария', [], 403);
        }

        // Обновление комментария с использованием проверенных данных
        $comment->content = $request->validated();
        $comment->save();

        // Возвращаем успешный ответ JSON
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
