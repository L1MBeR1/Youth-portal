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
    protected $model = UserMetadata::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'first_name' => $this->faker->firstName,
            'last_name' => $this->faker->lastName,
            'patronymic' => $this->faker->middleName,
            'nickname' => $this->faker->userName,
            'profile_image_uri' => $this->faker->imageUrl,
            'gender' => $this->faker->randomElement(['m', 'f']),
            'city' => $this->faker->city,
            'birthday' => $this->faker->date,
        ];
    }
}
