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
            'moder_id' => $this->getModeratorId(),
            'author_id' => \App\Models\User::factory(),
        ];
    }
        
        private function getModeratorId()
        {
            // Получаем всех пользователей с ролью модератора
            $moderators = \App\Models\User::whereHas('roles', function ($query) {
                $query->where('role_id', 8); // Проверяем, что роль модератора
            })->get();
        
            // Если есть модераторы, выбираем случайного
            if ($moderators->isNotEmpty()) {
                return $this->faker->randomElement($moderators)->id;
            }
        
            return null; // Если модераторов нет, возвращаем null
        }
        
}




