<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogRoleStatus;

class BlogRoleStatusSeeder extends Seeder
{
    public function run()
    {
        BlogRoleStatus::factory()->count(10)->create();
    }
}

