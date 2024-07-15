<?php

namespace Database\Seeders;

use App\Models\CommentToResource;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CommentToResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        CommentToResource::factory(400)->create();
    }
}
