<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organization>
 */
class OrganizationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     private function generateImageURL(int $width = 320, int $height = 240): string
     {
         // Для избежания кеширования изображений при многократном обращении к сайту
         $number = random_int(1, 100000);
         $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
         // return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
         return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
     }
    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->realText(30),
            'cover_uri' => $this->generateImageURL(),
        ];
    }
}
