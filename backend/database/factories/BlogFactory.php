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

    private function generateContent(): string
    {
        $basePlainText = $this->faker->realText(25000);
        $contentInnerPictures = [];
        $finalText = '';

        $sentences = preg_split('/(?<=[.!?])\s+/', $basePlainText);
        $paragraphs = [];
        $paragraph = '';

        foreach ($sentences as $sentence) {
            $paragraph .= $sentence . ' ';
            if (random_int(0, 10) > 7) {
                $paragraphs[] = trim($paragraph);
                $paragraph = '';
            }
        }
        if (!empty($paragraph)) {
            $paragraphs[] = trim($paragraph);
        }

        for ($i = 0; $i < random_int(1, 5); $i++) {
            $contentInnerPictures[] = $this->generateImageURL();
        }

        $htmlTags = ['<b>', '</b>', '<i>', '</i>', '<u>', '</u>', '<strong>', '</strong>', '<em>', '</em>'];

        foreach ($paragraphs as $paragraph) {
            $finalText .= '<p>';

            $words = explode(' ', $paragraph);
            foreach ($words as $word) {
                if (random_int(0, 10) > 7) { 
                    $tag = $htmlTags[array_rand($htmlTags)];
                    $word = $tag . $word . str_replace('<', '</', $tag);
                }
                $finalText .= $word . ' ';
            }

            $finalText = rtrim($finalText) . '</p>';

            if (random_int(0, 10) > 7 && !empty($contentInnerPictures)) {
                $image = array_shift($contentInnerPictures);
                $finalText .= '<div style="text-align:center;"><img src="' . $image . '" alt="Blog Image" style="max-width:100%;height:auto;"></div>';
            }
        }

        return $finalText;
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
            'content' => $this->generateContent(),
            'cover_uri' => $this->generateImageURL(),
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }
}
