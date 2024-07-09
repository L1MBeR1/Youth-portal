<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    //TODO: Сделать для всех ролей список разрешений
    public function run()
    {
        $roles = [
            'su' => [
                'manage users',
                'manage admins',
                'manage roles',
            ],
            'admin' => [
                'manage posts',
                'manage comments',
                'block/unblock users',
            ],
            'blogger' => [
                'view posts',
                'create posts',
                'edit own posts',
                'delete own posts',
                'comment posts',
                'edit own profile',
            ],
            'guest' => [
                'view posts',
            ],
            'organization' => [
                'view posts',
                'comment posts',
            ],
            'news_creator' => [
                'view posts',
                'comment posts',
            ],
            'user' => [
                'view posts',
                'comment posts',
            ],
        ];

        $createdPermissions = [];

        foreach ($roles as $roleName => $permissions) {
            $role = Role::create(['name' => $roleName]);
            foreach ($permissions as $permissionName) {
                if (!in_array($permissionName, $createdPermissions)) {
                    Permission::create(['name' => $permissionName]);
                    $createdPermissions[] = $permissionName;
                }
                $permission = Permission::where('name', $permissionName)->first();
                $role->givePermissionTo($permission);
            }
        }
    }
}
