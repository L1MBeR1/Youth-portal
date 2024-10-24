<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Services\ImageSeeder;  // Подключаем ImageSeeder для обработки изображений
use Log;

class UserMetadataFactory extends Factory
{
    protected $model = UserMetadata::class;

    private function generateProfileImageURL()
    {
        $imageSeeder = new ImageSeeder();
        // $image = $imageSeeder->generateImageURL(0, ['sample_images/profile' => 1], 'profiles');
        $image = null;
        try {
            $image = $imageSeeder->generateImageURL(0, ['sample_images/profile' => 1], 'profiles');
        } catch (\RuntimeException $e) {
            Log::error('Error during blog creation: ' . $e->getMessage());
            
            echo 'Error during blog creation: ' . $e->getMessage() . PHP_EOL;
            // return null;
            exit;
        }
        
        return $image[0];
    }

    private function getRandomNickname(): string
    {
        $adjectives = [
            'ru' => ['счастливый', 'быстрый', 'яркий', 'крутой', 'тихий', 'сладкий', 'злой', 'элегантный', 'удачливый', 'сказочный', 'умный', 'смелый', 'доброжелательный', 'сильный', 'веселый', 'любопытный', 'острый', 'спокойный', 'дружелюбный', 'мудрый'],
            'en' => ['happy', 'fast', 'bright', 'cool', 'silent', 'sweet', 'angry', 'fancy', 'lucky', 'candy', 'clever', 'brave', 'kind', 'strong', 'funny', 'curious', 'sharp', 'calm', 'friendly', 'wise']
        ];

        $nouns = [
            'ru' => ['кот', 'собака', 'птица', 'медведь', 'рыба', 'волк', 'лиса', 'тигр', 'лев', 'кролик', 'мышь', 'слон', 'жираф', 'обезьяна', 'пингвин', 'олень', 'лошадь', 'корова', 'сова', 'акула'],
            'en' => ['cat', 'dog', 'bird', 'bear', 'fish', 'wolf', 'fox', 'tiger', 'lion', 'rabbit', 'mouse', 'elephant', 'giraffe', 'monkey', 'penguin', 'deer', 'horse', 'cow', 'owl', 'shark']
        ];

        do {
            $locale = $this->faker->randomElement(['ru', 'en']);
            $number = random_int(1000, 9999);

            $adjective = $this->faker->randomElement($adjectives[$locale]);
            $noun = $this->faker->randomElement($nouns[$locale]);

            $nickname = "{$adjective}_{$noun}_{$number}";
        } while (UserMetadata::where('nickname', $nickname)->exists());

        return $nickname;
    }

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'patronymic' => $this->faker->middleName,
            'nickname' => $this->getRandomNickname(),
            'profile_image_uri' => $this->generateProfileImageURL(),  
            'gender' => $this->faker->randomElement(['m', 'f']),
            'city' => $this->faker->city,
            'birthday' => $this->faker->date,
        ];
    }

    public function configure()
    {
        return $this->afterMaking(function (UserMetadata $userMetadata) {
            $userMetadata->setKeyName('user_id');
        });
    }
}
