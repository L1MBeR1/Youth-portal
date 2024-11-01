<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Podcast;
use App\Services\ImageSeeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\Factory;

class PodcastFactory extends Factory
{
    protected $model = Podcast::class;
    private $image = null;
    private $audio = null;


    private function generateMediaURLs(int $podcastId)
    {
        $imageSeeder = new ImageSeeder();


        $mediaFiles = $imageSeeder->generateImageURL(
            $podcastId,
            [
                'sample_images/podcast_cover' => 1,
                'sample_audios/podcast_audio' => 1,
            ],
            'podcasts'
        );


        $this->image = $mediaFiles[0];
        $this->audio = $mediaFiles[1];

        return $mediaFiles;
    }

    // Генерация заголовка подкаста
    private function generatePodcastTitle()
    {
        $singularTitles = [
            'Тайна звукового фрагмента',
            'Фактор "почему"',
            'Мозговая волна',
            'Достойная новость',
            'Событие в гуще',
            'Нерассказанная история',
            'Миф и легенда',
            'Профессиональное обучение',
            'Раскрытие потенциала',
            'Презентация в лифте',
            'Раскопка истории',
            'Секрет успешного предпринимателя',
            'Мотив великого открытия',
            'Ритм творческого разума',
            'Сенсация дня',
            'Центр мировых событий',
            'Неизвестная правда',
            'Легенда о великом',
            'Путь к профессионализму',
            'Ключ к личностному росту',
            'Трибуна в бизнес-центре',
            'Артефакт забытой эпохи'
        ];

        $pluralTitles = [
            'Тайны звуковых фрагментов',
            'Факторы "почему"',
            'Мозговые волны',
            'Достойные новости',
            'События в гуще',
            'Нерассказанные истории',
            'Мифы и легенды',
            'Профессиональные обучения',
            'Раскрытия потенциалов',
            'Презентации в лифтах',
            'Раскопки историй',
            'Секреты успешных предпринимателей',
            'Мотивы великих открытий',
            'Ритмы творческих разумов',
            'Сенсации дня',
            'Центры мировых событий',
            'Неизвестные правды',
            'Легенды о великих',
            'Пути к профессионализму',
            'Ключи к личностному росту',
            'Трибуны в бизнес-центрах',
            'Артефакты забытых эпох'
        ];

        $isSingular = rand(0, 1);

        $titles = $isSingular ? $singularTitles : $pluralTitles;
        return $this->faker->randomElement($titles);
    }


    public function definition()
    {
        $userIds = User::pluck('id')->toArray();

        return [
            'title' => $this->generatePodcastTitle(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => [
                        $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                    ]
                ]
            ],
            'audio_uri' => '',
            'cover_uri' => '',
            // 'status' => $this->faker->randomElement(['moderating', 'published', 'archived', 'pending']),
            'status' => $this->faker->randomElement(['published']),
            'views' => $this->faker->numberBetween(0, 1000),
            'likes' => $this->faker->numberBetween(0, 1000),
            'reposts' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds),
        ];
    }

    public function configure(): self
    {
        return $this->afterCreating(function (Podcast $podcast) {
            // $this->generateMediaURLs($podcast->id);
            // $coverUri = $this->image;
            // $audioUri = $this->audio;
            // $podcast->update(['cover_uri' => $coverUri, 'audio_uri' => $audioUri]);


            try {
                $this->generateMediaURLs($podcast->id);
                $coverUri = $this->image;
                $audioUri = $this->audio;
                $podcast->update(['cover_uri' => $coverUri, 'audio_uri' => $audioUri]);
            } catch (\RuntimeException $e) {
                Log::error('Error during podcast creation: ' . $e->getMessage());

                echo 'Error during podcast creation: ' . $e->getMessage() . PHP_EOL;
            }
        });
    }
}
