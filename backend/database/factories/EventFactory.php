<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use App\Models\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Services\ImageSeeder;
use Illuminate\Support\Facades\Log;

class EventFactory extends Factory
{
    protected $model = Event::class;

    private function generateEventCover(int $eventId)
    {
        $imageSeeder = new ImageSeeder();
        $image = $imageSeeder->generateImageURL($eventId, ['sample_images/event_cover' => 1], 'events');
        return $image[0];
    }

    public function definition(): array
    {
        $userIds = User::pluck('id');
        $orgIds = Organization::pluck('id');
        $orgId = $this->faker->randomElement($orgIds->toArray());
        $projects = Project::where('organization_id', $orgId)->pluck('id')->toArray();

        return [
            'name' => $this->faker->company(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия']),
                ],
            ],
            'meta' => [
                'tags' => $this->faker->randomElements(['государство', 'предприятия', 'мебельная фабрика'], 2)
            ],
            'views' => $this->faker->numberBetween(0, 1000),
            'author_id' => $this->faker->randomElement($userIds->toArray()),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'start_time' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'end_time' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'project_id' => $this->faker->randomElement($projects),
        ];
    }


    public function configure(): self
    {
        return $this->afterCreating(function ($event) {
            // // Генерация cover_uri через ImageSeeder после создания записи
            // $coverUri = $this->generateEventCover($event->id);
            // $event->update(['cover_uri' => $coverUri]);

            try {
                // Генерация cover_uri через ImageSeeder после создания записи
                $coverUri = $this->generateEventCover($event->id);
                $event->update(['cover_uri' => $coverUri]);
            } catch (\RuntimeException $e) {
                Log::error('Error during event creation: ' . $e->getMessage());

                echo 'Error during event creation: ' . $e->getMessage() . PHP_EOL;
            }
        });
    }
}
