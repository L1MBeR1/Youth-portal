<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UserSeeder::class);
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(BlogSeeder::class);
        $this->call(PodcastSeeder::class);
        $this->call(NewsSeeder::class);
        $this->call(CommentSeeder::class);
        $this->call(CommentToResourceSeeder::class);
    }
}
