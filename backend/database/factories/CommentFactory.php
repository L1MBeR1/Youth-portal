<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [       
            'content' => $this->faker->realText(10) . $this->faker->emoji() . $this->faker->sentence(3),
            'user_id' => $this->faker->numberBetween(1, 50),
            'likes' => $this->faker->numberBetween(-50000, 1000000),
            // 'created_at' => $this->faker->dateTimeBetween('-11 month', 'now'),
            // 'updated_at' => $this->faker->dateTimeBetween('-11 month', 'now'),
        ];
    }
}
