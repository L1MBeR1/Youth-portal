<?php

namespace Database\Factories;

use App\Models\Organization;
// use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProjectFactory extends Factory
{
    private function generateProjectTitle()
    {
        $adjectives = [
            'Креативный', 'Творческий', 'Инновационный',
            'Спортивный', 'Культурный', 'Научный',
            'Технологический', 'Образовательный', 'Развлекательный'
        ];

        $nouns = [
            'лига', 'команда', 'ассоциация',
            'платформа', 'группа', 'сеть',
            'движение', 'фонд', 'центр'
        ];

        $locations = [
            'Иркутска', 'Сибири', 'России',
            'мира', 'вселенной', 'города',
            'региона', 'страны', 'континента'
        ];

        $adjective = $this->faker->randomElement($adjectives);
        $noun = $this->faker->randomElement($nouns);

        // Согласуем прилагательное с существительным
        if ($noun == 'лига' || $noun == 'команда' || $noun == 'ассоциация' || $noun == 'группа' || $noun == 'сеть') {
            $adjective = rtrim($adjective, 'ый') . 'ая';
        } elseif ($noun == 'движение' || $noun == 'фонд' || $noun == 'центр') {
            $adjective = rtrim($adjective, 'ый') . 'ое';
        } else {
            $adjective = rtrim($adjective, 'ый') . 'ый';
        }

        $location = $this->faker->randomElement($locations);

        return "$adjective $noun $location";
    }


    private function generateImageURL(int $width = 320, int $height = 240): string
    {
        // Для избежания кеширования изображений при многократном обращении к сайту
        $number = random_int(1, 100000);
        $category = $this->faker->randomElement(['cat', 'dog', 'bird']);
        // return "https://loremflickr.com/{$width}/{$height}/{$category}?random={$number}";
        return "https://loremflickr.com/{$width}/{$height}/{$category}?lock={$number}";
    }


    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $orgIds = Organization::pluck('id')->toArray();
        
        return [
            'name' => $this->generateProjectTitle(),
            'description' => [
                'desc' => $this->faker->realText(100),
                'meta' => [
                    'tags' => $this->faker->randomElement(['наука', 'культура', 'путешествия'])
                ]
            ],
            //'location' => 'задать(PROJECT_FACTORY.PHP)',
            //'organization_id' => $this->faker->randomElement($orgIds),
            'cover_uri' => $this->generateImageURL(),
            'created_at' => $this->faker->dateTimeBetween('-2 year', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
            
        ];
    }
}
