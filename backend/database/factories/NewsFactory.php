<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    private function generateImageURL2($id, $str = "news_cover"): string
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
        )->post("http://127.0.0.1:8000/api/files/news/{$id}/");

        if ($response->successful()) {
            $data = $response->json();
            return env('FILES_LINK', '') .$data['filename'] ?? '';
        }

        return '';
    }


    private function generateContent($blogid): string
    {
        $basePlainText = $this->faker->realText(400);
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

        for ($i = 0; $i < random_int(1, 2); $i++) {
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

    private function generateImageURL(int $width = 320, int $height = 240): string
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        // return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }
    protected $model = News::class;

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
        return $this->afterCreating(function (News $news) {
            // Генерация cover_uri после создания записи с корректным id
            $content = $this->generateContent($news->id);
            $coverUri = $this->generateImageURL2($news->id);
            $news->update(['cover_uri' => $coverUri, 'content' => $content]);
        });
    }
}
