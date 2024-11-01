<?php

namespace Database\Factories;

use App\Models\Organization;
use App\Services\ImageSeeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrganizationFactory extends Factory
{
    protected $model = Organization::class;


    private function generateOrganizationCover(int $organizationId)
    {
        $imageSeeder = new ImageSeeder();
        $image = $imageSeeder->generateImageURL($organizationId, ['sample_images/organization_cover' => 1], 'organizations');
        return $image[0];
    }


    private function generateRandomImage(int $width = 320, int $height = 240): string
    {
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);

        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }


    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->realText(30),
            'cover_uri' => $this->generateRandomImage(),
            'meta' => [
                'tags' => $this->faker->randomElements(['государство', 'предприятия', 'мебельная фабрика'], 2)
            ]
        ];
    }


    public function configure(): self
    {
        return $this->afterCreating(function (Organization $organization) {
            // $coverUri = $this->generateOrganizationCover($organization->id);
            // $organization->update(['cover_uri' => $coverUri]);

            try {
                $coverUri = $this->generateOrganizationCover($organization->id);
                $organization->update(['cover_uri' => $coverUri]);
            } catch (\RuntimeException $e) {
                Log::error('Error during organization creation: ' . $e->getMessage());

                echo 'Error during organization creation: ' . $e->getMessage() . PHP_EOL;
            }
        });
    }
}
