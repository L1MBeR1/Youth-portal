<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            'su' => [
                'manage users',                // управление пользователями
                'manage admins',               // управление администраторами
                'manage roles',                // управление ролями
                'manage permissions',          // управление разрешениями
                'view all logs',               // просмотр всех логов
                'manage system settings',      // управление системными настройками
                'impersonate users',           // вход от имени другого пользователя
                'view financial reports',      // просмотр финансовых отчетов
                'delete any post',             // удаление любого поста
                'restore deleted posts',       // восстановление удаленных постов
            ],
            'admin' => [
                'manage posts',                // управление постами
                'manage comments',             // управление комментариями
                'block/unblock users',         // блокировка/разблокировка пользователей
                'edit own news',               // редактирование собственных новостей
                'delete any comment',          // удаление любого комментария
                'view user profiles',          // просмотр профилей пользователей
                'view site analytics',         // просмотр аналитики сайта
                'manage categories',           // управление категориями
                'manage tags',                 // управление тегами
                'view reports',                // просмотр отчетов
            ],
            'blogger' => [
                'view posts',                  // просмотр постов
                'create posts',                // создание постов
                'edit own posts',              // редактирование собственных постов
                'delete own posts',            // удаление собственных постов
                'comment posts',               // комментирование постов
                'edit own profile',            // редактирование собственного профиля
                'edit news',                   // редактирование новостей
                'view analytics for own posts',// просмотр аналитики собственных постов
                'upload media',                // загрузка медиафайлов
            ],
            'guest' => [
                'view posts',                  // просмотр постов
                'view public comments',        // просмотр опубликованных комментариев
            ],
            'organization' => [ 
                'view posts',                  // просмотр постов
                'comment posts',               // комментирование постов
                'view organization profile',   // просмотр профиля организации
                'edit organization profile',   // редактирование профиля организации
                'create organization events',  // создание событий организации
            ],
            'news_creator' => [ 
                'view posts',                  // просмотр постов
                'comment posts',               // комментирование постов
                'edit own news',               // редактирование собственных новостей
                'create news',                 // создание новостей
                'delete own news',             // удаление собственных новостей
                'view news analytics',         // просмотр аналитики новостей
            ],
            'user' => [ 
                'view posts',                  // просмотр постов
                'comment posts',               // комментирование постов
                'create own profile',          // создание собственного профиля
                'edit own profile',            // редактирование собственного профиля
                'send messages',               // отправка сообщений
                'like posts',                  // лайк постов
                'follow users',                // подписка на пользователей
                'report posts',                // жалоба на посты
            ],
            'moderator' => [
                'view posts',                  // просмотр постов
                'comment posts',               // комментирование постов
                'edit own profile',            // редактирование собственного профиля
                'edit news',                   // редактирование новостей
                'approve posts',               // утверждение постов
                'remove offensive comments',   // удаление оскорбительных комментариев
                'block users',                 // блокировать пользователей
                'view reports',                // просмотр отчетов
                'resolve reports',             // разрешение отчетов
            ]
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
