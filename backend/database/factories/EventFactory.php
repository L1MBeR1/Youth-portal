<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userIds = User::pluck('id');
        $userId = $this->faker->randomElement($userIds->toArray());
        $projects = Project::where('author_id', '=', $userId)->pluck('id')->toArray();

        return [
            'name' => $this->faker->company(),
            'description' => json_encode([
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ]),
            'location' => 'задать(EVENT_FACTORY.PHP)',
            'views' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds->toArray()),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'start_time' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'end_time' => $this->faker->dateTimeBetween('-1 year', 'now'),

            'project_id' => $this->faker->randomElement($projects),
        ];
    }

}
