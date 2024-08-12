<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userIds = User::pluck('id')->toArray();
        
        return [
            'name' => $this->faker->company(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ],
            //'location' => 'задать(PROJECT_FACTORY.PHP)',
            'author_id' => $this->faker->randomElement($userIds),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
