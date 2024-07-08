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
        $su = Role::create(['name' => 'su']);
        $admin = Role::create(['name' => 'admin']);
        $blogger = Role::create(['name' => 'blogger']);
        $guest = Role::create(['name' => 'guest']);
        $organization = Role::create(['name' => 'organization']);
        $user = Role::create(['name' => 'user']);
        $news_creator = Role::create(['name' => 'news_creator']);

        $permissions = [
            // SU Permissions
            'manage users',
            'manage admins',
            'manage categories',
            'manage rewards',
            'manage roles',
            'manage settings',

            // Admin Permissions
            'manage posts',
            'manage comments',
            'block/unblock users',
            'view site statistics',

            // Author Permissions
            'create posts',
            'edit own posts',
            'delete own posts',
            'comment posts',
            'edit own profile',
            'view ranking and achievements',

            // User Permissions
            'view posts',
            // 'comment posts',
            'register and login',

            // Guest Permissions


            // Another Permissions
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $su->syncPermissions(Permission::all());

        $admin->syncPermissions([
            'manage posts',
            'manage comments',
            'block/unblock users',
            'view site statistics',
        ]);

        $blogger->syncPermissions([
            'create posts',
            'edit own posts',
            'delete own posts',
            'comment posts',
            'edit own profile',
            'view ranking and achievements',
        ]);

        $user->syncPermissions([
            'view posts',
            'comment posts',
            'register and login',
        ]);
    }
}
