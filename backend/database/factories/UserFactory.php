<?php

namespace Database\Factories;

use App\Models\UserMetadata;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition()
    {
        return [
            'password' => bcrypt('password'),
            'email' => $this->faker->unique()->safeEmail,
            'email_verified_at' => null,
            'phone' => $this->faker->unique()->phoneNumber,
            'phone_verified_at' => null,
            'remember_token' => null,
            'created_at' => now(),
            'updated_at' => now(),
            'blocked_at' => null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (User $user) {
            $role = $this->faker->randomElement([
                'moderator',
                'organization',
                'user',
                'user',
                'user',
                'user',
                'user',
                'user',
                'user',
                'user',
                'user',
                'user',
            ]);
            $user->assignRole($role);
            UserMetadata::factory()->create(['user_id' => $user->id]);
        });
    }
}

