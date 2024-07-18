<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Получить список всех пользователей с фильтрацией по роли
     * 
     * Получение списка всех пользователей с пагинацией, по 10 пользователей на страницу.
     * Фильтрация осуществляется по роли, переданной в параметре `role_name`.
     *
     * @group Пользователи
     * @urlParam role_name string Название роли для фильтрации пользователей.
     * @urlParam page int Номер страницы.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listUsers(Request $request)
    {
        $roleName = $request->query('role_name');
        $query = User::query();

        if ($roleName) {
            $query->whereHas('roles', function ($roleQuery) use ($roleName) {
                $roleQuery->where('name', $roleName);
            });
        }

        $users = $query->paginate(10);

        $response = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'first_name' => $user->metadata->first_name,
                'last_name' => $user->metadata->last_name,
                'patronymic' => $user->metadata->patronymic,
                'nickname' => $user->metadata->nickname,
                'profile_image_uri' => $user->metadata->profile_image_uri,
                'city' => $user->metadata->city,
                'gender' => $user->metadata->gender,
                'birthday' => $user->metadata->birthday,
            ];
        });

        $paginationData = [
            'current_page' => $users->currentPage(),
            'from' => $users->firstItem(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'to' => $users->lastItem(),
            'total' => $users->total(),
        ];

        return $this->successResponse($response, $paginationData, 200);
    }



    /**
     * Добавить
     * 
     * Добавить роль пользователю с ID `user_id` и названием роли `role_name`.
     *
     * @group Пользователи
     * @subgroup Роли
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function addRoleToUser($user_id, $role_name)
    {
        $user = User::find($user_id);
        $role = $role_name;

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->assignRole($role);

        return $this->successResponse([], 'Role added successfully');
    }


    /**
     * Удалить
     * 
     * Удалить роль у пользователя с ID `user_id` и названием роли `role_name`.
     * 
     * @group Пользователи
     * @subgroup Роли
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteRoleFromUser($user_id, $role_name)
    {
        $user = User::find($user_id);
        $role = $role_name;

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->assignRole($role);

        return $this->successResponse([], 'Role added successfully');
    }
}
