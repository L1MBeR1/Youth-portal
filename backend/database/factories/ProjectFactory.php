<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Organization;
use App\Services\ImageSeeder;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    protected $model = Project::class;


    private function generateProjectTitle()
    {
        $adjectives = [
            'Креативный',
            'Творческий',
            'Инновационный',
            'Спортивный',
            'Культурный',
            'Научный',
            'Технологический',
            'Образовательный',
            'Развлекательный'
        ];

        $nouns = [
            'лига',
            'команда',
            'ассоциация',
            'платформа',
            'группа',
            'сеть',
            'движение',
            'фонд',
            'центр'
        ];

        $locations = [
            'Иркутска',
            'Сибири',
            'России',
            'мира',
            'вселенной',
            'города',
            'региона',
            'страны',
            'континента'
        ];

        $adjective = $this->faker->randomElement($adjectives);
        $noun = $this->faker->randomElement($nouns);
        $location = $this->faker->randomElement($locations);


        $adjective = match ($noun) {
            'лига', 'команда', 'ассоциация', 'группа', 'сеть' => rtrim($adjective, 'ый') . 'ая',
            'движение', 'фонд', 'центр' => rtrim($adjective, 'ый') . 'ое',
            default => rtrim($adjective, 'ый') . 'ый'
        };

        return "$adjective $noun $location";
    }


    private function generateProjectCover(int $projectId): string
    {
        $imageSeeder = new ImageSeeder();
        $image = $imageSeeder->generateImageURL($projectId, ['sample_images/project_cover' => 1], 'projects');
        return $image[0];
    }


    public function definition(): array
    {
        $orgIds = Organization::pluck('id')->toArray();

        return [
            'name' => $this->generateProjectTitle(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия']),
                ],
            ],
            'cover_uri' => '',
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }


    public function configure(): self
    {
        return $this->afterCreating(function (Project $project) {
            // $coverUri = $this->generateProjectCover($project->id);
            // $project->update(['cover_uri' => $coverUri]);


            try {
                $coverUri = $this->generateProjectCover($project->id);
                $project->update(['cover_uri' => $coverUri]);
            } catch (\RuntimeException $e) {
                Log::error('Error during project creation: ' . $e->getMessage());

                echo 'Error during project creation: ' . $e->getMessage() . PHP_EOL;
            }
        });
    }
}
