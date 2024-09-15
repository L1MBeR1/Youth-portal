<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class EventFactory extends Factory
{

    private function generateImageURL2($id, $str = "event_cover"): string
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
        )->post("http://127.0.0.1:8000/api/files/events/{$id}/");

        if ($response->successful()) {
            $data = $response->json();
            return env('FILES_LINK', '') .$data['filename'] ?? '';
        }

        return '';
    }
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $userIds = User::pluck('id');
        $orgIds = Organization::pluck('id');
        // $userId = $this->faker->randomElement($userIds->toArray());
        $orgId = $this->faker->randomElement($orgIds->toArray());
        $projects = Project::where('organization_id', '=', $orgId)->pluck('id')->toArray();

        return [
            'name' => $this->faker->company(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ],
            //'location' => 'задать(EVENT_FACTORY.PHP)',
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
