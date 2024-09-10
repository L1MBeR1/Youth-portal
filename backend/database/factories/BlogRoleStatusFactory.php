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
            'moder_id' => \App\Models\User::factory(),
            'author_id' => \App\Models\User::factory(),
        ];
    }
}




