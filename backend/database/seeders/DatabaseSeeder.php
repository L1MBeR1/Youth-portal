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
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(UsersWithRolesSeeder::class);
        $this->call(OrganizationSeeder::class);
        $this->call(BlogSeeder::class);
        $this->call(PodcastSeeder::class);
        $this->call(NewsSeeder::class);
        $this->call(DeepCommentsSeeder::class);
        // $this->call(CommentSeeder::class);
        // $this->call(CommentToResourceSeeder::class);
        $this->call(ProjectSeeder::class);
        // $this->call(EventSeeder::class);
        $this->call(EventSeeder2::class);
    }
}
