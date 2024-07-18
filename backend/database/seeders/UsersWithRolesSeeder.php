<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Database\Seeder;

class UsersWithRolesSeeder extends Seeder
{
    public function run()
    {
        $roles = [
            'su', 'admin', 'moderator', 'blogger', 'guest', 'organization', 'user', 'news_creator'
        ];

        foreach ($roles as $role) {
            $user = User::create([
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
            
            UserMetadata::factory()->create(['user_id' => $user->id]);
        }
    }
}
