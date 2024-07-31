<?php

namespace Database\Factories;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory <\App\Models\Model>
 */
class UserMetadataFactory extends Factory
{
    private function generateImageURL(int $width = 320, int $height = 240): string 
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000); 
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
    }
    protected $model = UserMetadata::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'patronymic' => $this->faker->middleName,
            'nickname' => $this->faker->userName,
            'profile_image_uri' => $this->generateImageURL(128, 128),
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
