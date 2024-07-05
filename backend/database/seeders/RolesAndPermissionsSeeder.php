<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        $su = Role::create(['name' => 'su']);
        $admin = Role::create(['name' => 'admin']);
        $author = Role::create(['name' => 'author']);
        $user = Role::create(['name' => 'user']);

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
            'comment posts',
            'register and login',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        $su->givePermissionTo(Permission::all());

        $admin->givePermissionTo([
            'manage posts',
            'manage comments',
            'block/unblock users',
            'view site statistics',
        ]);

        $author->givePermissionTo([
            'create posts',
            'edit own posts',
            'delete own posts',
            'comment posts',
            'edit own profile',
            'view ranking and achievements',
        ]);

        $user->givePermissionTo([
            'view posts',
            'comment posts',
            'register and login',
        ]);
    }
}
