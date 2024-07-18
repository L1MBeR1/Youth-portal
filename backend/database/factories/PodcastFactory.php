<?php

namespace Database\Factories;

use App\Models\Podcast;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PodcastFactory extends Factory
{
    protected $model = Podcast::class;

    public function definition()
    {
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->faker->bank(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ],
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
