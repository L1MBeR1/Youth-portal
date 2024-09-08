<?php

namespace Database\Factories;

use Carbon\Carbon;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Blog>
 */
class BlogFactory extends Factory
{
    protected $model = Blog::class;

    // Функция для генерации URL случайного изображения
    private function generateImageURL(int $width = 320, int $height = 240): string
    {
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }

    // Функция для загрузки изображения с файла и получения его имени
    private function generateImageURL2($id, $str = "blog_cover"): string
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
        )->post("http://127.0.0.1:8000/api/files/blogs/{$id}/");

        if ($response->successful()) {
            $data = $response->json();
            return env('FILES_LINK', '') .$data['filename'] ?? '';
        }

        return '';
    }

    // Генерация контента блога
    private function generateContent($blogid): string
    {
        $basePlainText = $this->faker->realText(15000);
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
            $contentInnerPictures[] = $this->generateImageURL2($blogid, 'blog_content');
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
        $year = random_int(2019, 2022);
        $month = random_int(1, 12);
        $day = random_int(1, 28);
        $time = "{$year}-{$month}-{$day} 10:00:00";
        $timezone = 'Europe/Moscow';
        $dateTime = Carbon::createFromFormat('Y-m-d H:i:s', $time, $timezone)->setTimezone('UTC');

        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->faker->company(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => [
                        $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                    ]
                ]
            ],
            'content' => '12',
            'cover_uri' => '', // временно пустое поле
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'created_at' => $dateTime->format('Y-m-d H:i:s'),
            'updated_at' => $dateTime->format('Y-m-d H:i:s'),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }

    // Пост-обработка модели после создания
    public function configure(): self
    {
        return $this->afterCreating(function (Blog $blog) {
            // Генерация cover_uri после создания записи с корректным id
            $content = $this->generateContent($blog->id);
            $coverUri = $this->generateImageURL2($blog->id);
            $blog->update(['cover_uri' => $coverUri, 'content' => $content]);
        });
    }
}
