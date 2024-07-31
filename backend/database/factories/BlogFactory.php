<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Factory as FakerFactory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    private function generateImageURL(int $width = 320, int $height = 240): string 
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000); 
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
    }




    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = FakerFactory::create('ru_RU');
        $userIds = User::pluck('id')->toArray();
        $desc = $this->faker->realText(100);
        return [
            'title' => $this->faker->company(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ],
            'content' => $this->faker->realText(100),
            'cover_uri' => $this->generateImageURL(),
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }
}
