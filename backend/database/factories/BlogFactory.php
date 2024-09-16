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

    // Функция для загрузки изображения с файла и получения его имени
    private function generateImageURL($id, $str = "blog_cover"): string
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
            $contentInnerPictures[] = $this->generateImageURL($blogid, 'blog_content');
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


    private function generateBlogTitle()
    {
        $adjectiveOptions = [
            'мужской род' => [
                'Вдохновляющий', 'Познавательный', 'Захватывающий',
                'Мотивирующий', 'Вдумчивый', 'Откровенный',
                'Провокационный', 'Интригующий', 'Эмоциональный',
                'Практичный', 'Творческий', 'Аналитический',
                'Увлекательный', 'Глубокий', 'Смелый',
                'Искренний', 'Проницательный', 'Вдохновляющий'
            ],
            'женский род' => [
                'Вдохновляющая', 'Познавательная', 'Захватывающая',
                'Мотивирующая', 'Вдумчивая', 'Откровенная',
                'Провокационная', 'Интригующая', 'Эмоциональная',
                'Практичная', 'Творческая', 'Аналитическая',
                'Увлекательная', 'Глубокая', 'Смелая',
                'Искренняя', 'Проницательная', 'Вдохновляющая'
            ],
            'средний род' => [
                'Вдохновляющее', 'Познавательное', 'Захватывающее',
                'Мотивирующее', 'Вдумчивое', 'Откровенное',
                'Провокационное', 'Интригующее', 'Эмоциональное',
                'Практичное', 'Творческое', 'Аналитическое',
                'Увлекательное', 'Глубокое', 'Смелое',
                'Искреннее', 'Проницательное', 'Вдохновляющее'
            ]
        ];

        $nounOptions = [
            'мужской род' => [
                'опыт', 'путь', 'стиль',
                'взгляд', 'мир', 'подход',
                'разум', 'дух', 'поиск',
                'выбор', 'успех'
            ],
            'женский род' => [
                'жизнь', 'душа', 'мечта',
                'страсть', 'идея', 'история',
                'свобода', 'любовь', 'цель',
                'мудрость', 'сила', 'перемена'
            ],
            'средний род' => [
                'саморазвитие', 'здоровье', 'хобби',
                'путешествие', 'искусство', 'дело',
                'вдохновение', 'приключение', 'творчество',
                'достижение', 'открытие', 'будущее'
            ]
        ];

        $thirdWordOptions = [
            'мужской род' => ['пути', 'разума', 'духа', 'выбора', 'успеха'],
            'женский род' => ['мечты', 'страсти', 'идеи', 'свободы', 'любви', 'цели', 'мудрости', 'силы'],
            'средний род' => ['человека', 'мудрости', 'озарения', 'странствия']
        ];

        $adjectiveGender = array_rand($adjectiveOptions);
        $nounGender = $adjectiveGender;
        $thirdWordGender = $adjectiveGender;

        $adjective = $this->faker->randomElement($adjectiveOptions[$adjectiveGender]);
        $noun = $this->faker->randomElement($nounOptions[$nounGender]);
        $thirdWord = $this->faker->randomElement($thirdWordOptions[$thirdWordGender]);

        return "$adjective $noun $thirdWord";
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
            'title' => $this->generateBlogTitle(),
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
            $coverUri = $this->generateImageURL($blog->id);
            $blog->update(['cover_uri' => $coverUri, 'content' => $content]);
        });
    }
}
