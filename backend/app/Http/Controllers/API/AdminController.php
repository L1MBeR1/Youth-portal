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
    public function hello()
    {
        return $this->successResponse([], 'You are an admin!', 200);
    }


    public function createPermission(Request $request)
    {
        try {
            Permission::create(['name' => $request->permission_name]);
        } catch (\Throwable $exception) {
            return $this->errorResponse('Произошла ошибка при создании разрешения', $exception->getMessage(), 500);
        }

        return $this->successResponse([], 'Разрешение создано', 200);
    }


    public function createRole(Request $request)
    {
        try {
            $role = Role::create(['name' => $request->role_name]);
        } catch (\Throwable $exception) {
            return $this->errorResponse('Произошла ошибка при создании роли', $exception->getMessage(), 500);
        }

        return $this->successResponse($role, 'Роль создана', 200);
    }


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


    public function listUserWithRole($role_name)
    {
        $users = User::role($role_name)->get();

        return $this->successResponse($users, 'Список пользователей с ролью [' . $role_name . ']', 200);
    }


    public function listRoles(){

        $roles = Role::all();
        return $this->successResponse($roles, 'Список ролей', 200);
    }

    public function listPermissions(){

        $permissions = Permission::all();
        return $this->successResponse($permissions, 'Список разрешений', 200);
    }


    public function createBlog()
    {
        //
    }

    public function updateBlog($postId)
    {
        //
    }

    public function deleteBlog($postId)
    {
        //
    }

    public function updateSettings()
    {
        //
    }
}
