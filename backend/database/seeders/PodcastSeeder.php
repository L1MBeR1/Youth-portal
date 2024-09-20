<?php

namespace Database\Seeders;

use App\Models\Podcast;
use Illuminate\Database\Seeder;

class PodcastSeeder extends Seeder
{
    public function run(): void
    {
        Podcast::factory(30)->create();
    }
}
