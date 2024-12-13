<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\OrganizationRoleStatus;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\SetContentStatusRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use Symfony\Component\HttpFoundation\Response;




class OrganizationRoleStatusController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
    public function store(Request $request)
    {
        if (!Auth::user()->hasRole('user')) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $organization_role_status = OrganizationRoleStatus::create([
            'status' => 'review',
            'author_id' => Auth::id(),
            'content' => $request->input('content'),
        ]);

        return $this->successResponse(['organization_role_status' => $organization_role_status], 'Created successfully', 200);
    }

    public function destroy($id)
    {
        $organization_role_status = OrganizationRoleStatus::find($id);

        if (!Auth::user()->can('delete', $organization_role_status)) {
            return $this->errorResponse('Нет прав на удаление', [], 403);
        }

        if (!$organization_role_status) {
            return $this->errorResponse('Запись не найден', [], 404);
        }

        $res = $organization_role_status->delete();
        if ($res) {
            return $this->successResponse([], 'Запись успешно удален');
        }
        return $this->errorResponse('Не удалось удалить запись', [], 500);
    }

    public function setStatus(SetContentStatusRequest $request, $id)
    {
        $organization_role_status = OrganizationRoleStatus::find($id);

        if (!$organization_role_status) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('changeStatus', $news_role_status)) {
            return $this->errorResponse('Отсутствуют разрешения', [], Response::HTTP_FORBIDDEN);
        }

        $request->validated();

        // Изменяем статус
        $newStatus = $request->input('status');
        $organization_role_status->status = $newStatus;

        // Проверяем, если статус "approved"
        if ($organization_role_status->status === 'approved') {
            // Устанавливаем moder_id
            $organization_role_status->moder_id = Auth::id(); // Получаем ID текущего пользователя
        } elseif ($organization_role_status->status === 'withdrawn' || $organization_role_status->status === 'review') {
            // Находим пользователя по author_id
            $user = User::find($organization_role_status->author_id);

            if ($user) {
                // Удаляем роль с role_id = 8 (или нужный вам ID) у пользователя
                $user->roles()->detach(5); // Здесь 8 - это ID роли, которую нужно удалить
            }
        }


        $organization_role_status->save(); // Сохраняем изменения

        // Проверяем, если статус "approved" и добавляем запись в model_has_roles
        if ($organization_role_status->status === 'approved') {
            // Находим пользователя по author_id
            $user = User::find($organization_role_status->author_id);

            if ($user) {
                // Проверяем, есть ли уже роль с role_id = 8
                if (!$user->roles()->where('role_id', 5)->exists()) {
                    // Присваиваем роль пользователю
                    $user->roles()->attach(5); // Здесь 8 - это ID роли, которую нужно добавить
                }
            }
        }



        return $this->successResponse($organization_role_status, 'Запись успешно обновлена', Response::HTTP_OK);
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
    public function getNewsRolesStatusList(Request $request)
    {
        if (!Auth::user()->can('getList', OrganizationRoleStatus::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "organization_role_status" => [
                "id",
                "status",
                "content",
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

        $query = $this->buildPublicationQuery($request, OrganizationRoleStatus::class, $requiredFields);
        $organization_role_status = $query->paginate($request->get('per_page', 10));

        // Получаем данные о модераторах, если статус 'issued'
        foreach ($organization_role_status as $news) {
            if ($news->status === 'approved' || $news->status === 'withdrawn') {
                $moderator = $news->moderator; // Получаем модератора
            }
        }

        $paginationData = $this->makePaginationData($organization_role_status);
        return $this->successResponse($organization_role_status->items(), $paginationData, 200);
    }
}
