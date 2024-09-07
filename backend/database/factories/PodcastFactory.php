<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Podcast;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

class PodcastFactory extends Factory
{
    private function generateImageURL2($id, $str = "podcast_cover"): string
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
        )->post("http://127.0.0.1:8000/api/files/podcasts/{$id}/");

        if ($response->successful()) {
            $data = $response->json();
            return env('FILES_LINK', '') .$data['filename'] ?? '';
        }

        return '';
    }

    private function generateImageURL(int $width = 320, int $height = 240): string
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        // return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }


    protected $model = Podcast::class;

    public function definition()
    {
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->faker->bank(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => [
                        $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                    ]
                ]
            ],
            'content' => $this->faker->realText(100),
            'cover_uri' => $this->generateImageURL(),
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 1000),
            'reposts' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Podcast $podcast) {
        
            $coverUri = $this->generateImageURL2($podcast->id);
            $podcast->update(['cover_uri' => $coverUri]);
        });
    }
}
