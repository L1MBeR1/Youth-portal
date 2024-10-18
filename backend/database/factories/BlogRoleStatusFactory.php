<?php

namespace Database\Factories;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogRoleStatus>
 */
use App\Models\BlogRoleStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogRoleStatusFactory extends Factory
{
    protected $model = BlogRoleStatus::class;

    public function definition()
    {
        return [
            'status' => $this->faker->randomElement(['review', 'approved', 'withdrawn']),
            'content' => $this->faker->realText(100),
            'moder_id' => $this->getModeratorId(),
            'author_id' => \App\Models\User::factory(), // Создание нового пользователя
        ];
    }
        
    private function getModeratorId()
    {
        // Получаем случайного пользователя с ролью модератора
        return \App\Models\User::whereHas('roles', function ($query) {
            $query->where('role_id', 8); // Проверяем, что роль модератора
        })->inRandomOrder()->first()?->id; // Используем оператор null-safe
    }
}
