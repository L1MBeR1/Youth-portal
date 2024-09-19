<?php

namespace Database\Factories;

use App\Models\News;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Services\ImageSeeder;

class NewsFactory extends Factory
{
    protected $model = News::class;
    private $images = [];
    private $imageCount = null;

    private function generateImageURLs(int $newsId): array
    {
        $imageSeeder = new ImageSeeder();
        $this->imageCount = random_int(1, 2); // Количество изображений для контента

        // Генерация URL для изображений контента и обложки
        $this->images = $imageSeeder->generateImageURL(
            $newsId,
            [
                'sample_images/news_content' => $this->imageCount,
                'sample_images/news_cover' => 1,
            ],
            'news'
        );

        return $this->images;
    }

    // Генерация контента новости
    private function generateContent($newsId): string
    {
        $basePlainText = $this->faker->realText(400);
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

        // HTML-теги для стилизации текста
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

            // Вставка изображений в текст
            if (random_int(0, 10) > 7 && count($this->images) > 1) {
                $image = array_shift($this->images);
                $finalText .= '<div style="text-align:center;"><img src="' . $image . '" alt="News Image" style="max-width:100%;height:auto;"></div>';
            }
        }

        return $finalText;
    }

    // Генерация заголовка новости
    private function generateTitle()
    {
        $adjectives = [
            'Новые', 'Удивительные', 'Сенсационные', 
            'Эксклюзивные', 'Скандальные', 'Неожиданные', 
            'Интригующие', 'Захватывающие', 'Актуальные'
        ];

        $nouns = [
            'открытия', 'факты', 'доклады', 
            'исследования', 'события', 'анализы', 
            'тренды', 'проблемы', 'решения'
        ];

        $verbs = [
            'показывают', 'подтверждают', 'разоблачают', 
            'объясняют', 'предсказывают', 'поднимают вопросы', 
            'вызывают интерес', 'открывают новые горизонты'
        ];

        $phrases = [
            'в мире', 'в деталях', 'в современном обществе', 
            'в последние дни', 'в контексте событий', 'в новых исследованиях'
        ];

        $adjective = $this->faker->randomElement($adjectives);
        $noun = $this->faker->randomElement($nouns);
        $verb = $this->faker->randomElement($verbs);
        $phrase = $this->faker->randomElement($phrases);

        return "$adjective $noun $verb $phrase.";
    }

    // Определение состояния модели по умолчанию
    public function definition()
    {
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->generateTitle(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => [
                        $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                    ]
                ]
            ],
            'content' => $this->faker->realText(100),
            'cover_uri' => '', // поле будет заполнено позже
            'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 1000),
            'reposts' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }

    // Настройка модели после создания
    public function configure(): self
    {
        return $this->afterCreating(function (News $news) {
            $this->generateImageURLs($news->id);
            $content = $this->generateContent($news->id);
            $coverUri = $this->images[0] ?? '';
            $news->update(['cover_uri' => $coverUri, 'content' => $content]);
        });
    }
}
