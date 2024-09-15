<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use Carbon\Carbon;
use App\Models\Organization;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

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

     private function generateImageURL2($id, $str = "organization_cover"): string
    {
        $files = Storage::disk('local')->files("sample_images/{$str}");

        if (empty($files)) {
            Log::info('empty folder');
            return '';
        }

        $randomFile = $files[array_rand($files)];
        $filePath = Storage::disk('local')->path($randomFile);

        $response = Http::attach(
            'file',
            file_get_contents($filePath),
            basename($filePath)
        )->post("http://127.0.0.1:8000/api/files/organizations/{$id}/");

        if ($response->successful()) {
            $data = $response->json();
            return env('FILES_LINK', '') .$data['filename'] ?? '';
        }

        return '';
    }

    public function definition(): array
    {
        return [
            'name' => $this->faker->company(),
            'description' => $this->faker->realText(30),
            'cover_uri' => $this->generateImageURL(),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Organization $organization) {
            // Генерация cover_uri после создания записи с корректным id
            $coverUri = $this->generateImageURL2($organization->id);
            $organization->update(['cover_uri' => $coverUri]);
        });
    }
}
