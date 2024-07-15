<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UsersWithRolesSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            'su', 'admin', 'moderator', 'blogger', 'guest', 'organization', 'user', 'news_creator'
        ];

        foreach ($roles as $role) {
            User::create([
                'password' => bcrypt('password'),
                'email' => $role . '@example.org',
                'email_verified_at' => now(),
                'phone' => null,
                'phone_verified_at' => null,
                'remember_token' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'blocked_at' => null,
            ])->assignRole($role);
        }
    }
}
