<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\BlogRoleStatus;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\SetContentStatusRequest;
use App\Http\Requests\UpdateBlogRequest;
use Symfony\Component\HttpFoundation\Response;




class BlogRoleStatusController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
    public function store(Request $request)
    {
        if (!Auth::user()->can('create', BlogRoleStatus::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $blog_role_status = BlogRoleStatus::create([
            'status' => 'review',
            'author_id' => Auth::id(),
        ]);

        return $this->successResponse(['blog_role_status' => $blog_role_status], 'Created successfully', 200);
    }

    public function destroy($id)
    {
        $blog_role_status = BlogRoleStatus::find($id);

        if (!Auth::user()->can('delete', $blog_role_status)) {
            return $this->errorResponse('Нет прав на удаление', [], 403);
        }

        if (!$blog_role_status) {
            return $this->errorResponse('Запись не найден', [], 404);
        }

        $res = $blog_role_status->delete();
        if ($res) {
            return $this->successResponse([], 'Запись успешно удален');
        }
        return $this->errorResponse('Не удалось удалить запись', [], 500);
    }

    public function setStatus(SetContentStatusRequest $request, $id)
{
    $blog_role_status = BlogRoleStatus::find($id);

    if (!$blog_role_status) {
        return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
    }

    if (!Auth::user()->can('changeStatus', $blog_role_status)) {
        return $this->errorResponse('Отсутствуют разрешения', [], Response::HTTP_FORBIDDEN);
    }

    $request->validated();

    // Изменяем статус
    $newStatus = $request->input('status');
    $blog_role_status->status = $newStatus;

    // Проверяем, если статус "approved"
    if ($blog_role_status->status === 'approved') {
        // Устанавливаем moder_id
        $blog_role_status->moder_id = Auth::id(); // Получаем ID текущего пользователя
    } elseif ($blog_role_status->status === 'withdrawn' || $blog_role_status->status === 'review') {
        // Находим пользователя по author_id
        $user = \App\Models\User::find($blog_role_status->author_id);
    
        if ($user) {
            // Удаляем роль с role_id = 8 (или нужный вам ID) у пользователя
            $user->roles()->detach(8); // Здесь 8 - это ID роли, которую нужно удалить
        }
    }
    

    $blog_role_status->save(); // Сохраняем изменения

    // Проверяем, если статус "approved" и добавляем запись в model_has_roles
    if ($blog_role_status->status === 'approved') {
        // Находим пользователя по author_id
        $user = \App\Models\User::find($blog_role_status->author_id);
    
        if ($user) {
            // Проверяем, есть ли уже роль с role_id = 8
            if (!$user->roles()->where('role_id', 8)->exists()) {
                // Присваиваем роль пользователю
                $user->roles()->attach(8); // Здесь 8 - это ID роли, которую нужно добавить
            }
        }
    }
      
    

    return $this->successResponse($blog_role_status, 'Запись успешно обновлена', Response::HTTP_OK);
}

    /**
     * Поиск
     * 
     * 
     * @group Блоги
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @urlParam page int Номер страницы.
     * @urlParam per_page int Элементов на странице.
     * 
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
    public function getBlogRolesStatusList(Request $request)
    {
        if (!Auth::user()->can('getList', BlogRoleStatus::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "blog_role_status" => [
                "id",
                "status",
                "created_at",
                "updated_at",
                "moder_id", // Добавляем moder_id для получения данных о модераторе
            ],
            "user_metadata" => [
                "first_name",
                "last_name",
                "patronymic",
                "nickname",
            ]
        ];

        $query = $this->buildPublicationQuery($request, BlogRoleStatus::class, $requiredFields);
        $blog_role_status = $query->paginate($request->get('per_page', 10));

        // Получаем данные о модераторах, если статус 'issued'
        foreach ($blog_role_status as $blog) {
            if ($blog->status === 'approved' || $blog->status === 'withdrawn') {
                $moderator = $blog->moderator; // Получаем модератора
            }
        }

        $paginationData = $this->makePaginationData($blog_role_status);
        return $this->successResponse($blog_role_status->items(), $paginationData, 200);
    }



}
