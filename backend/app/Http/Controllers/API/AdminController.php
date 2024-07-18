<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminController extends Controller
{
    /**
     * Приветствие
     * 
     * Проверка на админку
     * 
     * @group Администрирование
     * @header Authorization Bearer {token}
     * @authenticated
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function hello()
    {
        return $this->successResponse([], 'You are an admin!', 200);
    }

    /**
     * Создать
     * 
     * Создание нового разрешения
     * 
     * @group Администрирование
     * @subgroup Разрешения
     * @subgroupDescription Управление разрешениями
     * @header Authorization Bearer {token}
     * @authenticated
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function createPermission(Request $request)
    {
        try {
            Permission::create(['name' => $request->permission_name]);
        } catch (\Throwable $exception) {
            return $this->errorResponse('Произошла ошибка при создании разрешения', $exception->getMessage(), 500);
        }

        return $this->successResponse([], 'Разрешение создано', 200);
    }

    /**
     * Создать
     * 
     * Создание новой роли
     *      
     * @group Администрирование
     * @subgroup Роли
     * @subgroupDescription Управление ролями
     * @authenticated
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function createRole(Request $request)
    {
        try {
            $role = Role::create(['name' => $request->role_name]);
        } catch (\Throwable $exception) {
            return $this->errorResponse('Произошла ошибка при создании роли', $exception->getMessage(), 500);
        }

        return $this->successResponse($role, 'Роль создана', 200);
    }

    /**
     * Список
     * 
     * Получить список пользователей с ролью `organization
     * 
     * @group Администрирование
     * @subgroup Организации
     * @authenticated 
     *`
     *
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getOrganizations()
    {
        $users = User::role('organization')->paginate(10);

        return $this->successResponse($users, `Список пользователей с ролью 'organization'`, 200);
    }




    /**
     * Добавить разрешение
     * 
     * Добавить разрешение к роли
     * 
     * @group Администрирование
     * @subgroup Роли
     * 
     * @bodyParam permissions array[] массив разрешений 
     * @authenticated
     * @param \Illuminate\Http\Request $request
     * @param mixed $role_name
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function addPermissionsToRole(Request $request, $role_name)
    {
        $permissions = $request->input('permissions');
        $role = Role::findByName($role_name);

        if ($role) {
            $role->syncPermissions($permissions);
            $permissions = $role->permissions->pluck('name');
            return $this->successResponse([
                'permissions' => $permissions,
                // 'role' => $role
            ], 'Разрешения добавлены', 200);
        } else {
            return $this->errorResponse('Произошла ошибка при добавлении разрешений', 500);
        }
    }


    // public function deleteRole($role_name){
    // 
    // }


    // public function deletePermission($permission_name){
    //
    // }

    /** 
     * Получить пользователей по роли
     * 
     * Получить пользователей по роли `role_name`
     * 
     * @group Администрирование
     * 
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * 
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s).
     * @param mixed $role_name
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function listUserWithRole(Request $request, $role_name)
    {
        $query = User::query();

        // Получаем параметры из запроса
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

        // Добавляем условия поиска только если параметры переданы
        if ($searchColumnName && $searchValue) {
            $query->join('metadata', 'users.id', '=', 'metadata.user_id')
                ->where('metadata.' . $searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if ($crtFrom && $crtTo) {
            $query->whereBetween('users.created_at', [$crtFrom, $crtTo]);
        } elseif ($crtFrom) {
            $query->where('users.created_at', '>=', $crtFrom);
        } elseif ($crtTo) {
            $query->where('users.created_at', '<=', $crtTo);
        }

        if ($updFrom && $updTo) {
            $query->whereBetween('users.updated_at', [$updFrom, $updTo]);
        } elseif ($updFrom) {
            $query->where('users.updated_at', '>=', $updFrom);
        } elseif ($updTo) {
            $query->where('users.updated_at', '<=', $updTo);
        }

        // Применяем фильтр по роли
        // $query->whereHas('roles', function ($q) use ($role_name) {
        //     $q->where('name', $role_name);
        // });

        // Выполняем запрос с пагинацией
        $users = $query->paginate(10);

        return $this->successResponse($users, 'Список пользователей с ролью [' . $role_name . ']', 200);
    }


    /**
     * Список
     * 
     * Получить список всех ролей
     * 
     * @group Администрирование
     * 
     * @subgroup Роли
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function listRoles()
    {

        $roles = Role::all();
        return $this->successResponse($roles, 'Список ролей', 200);
    }


    /**
     * Список
     * 
     * Получить список всех разрешений
     * 
     * @group Администрирование
     * 
     * @subgroup Разрешения
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function listPermissions()
    {

        $permissions = Permission::all();
        return $this->successResponse($permissions, 'Список разрешений', 200);
    }
}
