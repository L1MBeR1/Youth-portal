<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition()
    {
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->faker->bank(),
            'description' => $this->faker->realText(100),
            'content' => $this->faker->realText(100),
            'cover_uri' => $this->faker->imageUrl(),
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 1000),
            'reposts' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }
}
