<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Получить список всех пользователей
     * 
     * Получение списка всех пользователей с пагинацией, по 10 пользователей на страницу.
     * Страницы передаются в параметре `page`.
     *
     * @group Пользователи
     * @bodyParam page int номер страницы.
     * @return \Illuminate\Http\JsonResponse
     */
    public function listUsers()
    {
        $users = User::paginate(10);

        $response = $users->map(function ($user) {
            return [
                'metadata' => $user->metadata,
            ];
        });

        return $this->successResponse($response, [
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'next_page_url' => $users->nextPageUrl(),
                'prev_page_url' => $users->previousPageUrl(),
            ],
        ]);
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
