<?php

namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Database\Seeder;
use App\Models\CommentToResource;
use Faker\Factory as FakerFactory;

class DeepCommentsSeeder extends Seeder
{
    private $faker;

    public function __construct()
    {
        $this->faker = FakerFactory::create();
    }

    public function run()
    {
        $resources = ['blog' => 40, 'news' => 30, 'podcast' => 10];

        foreach ($resources as $key => $value) {
            for ($i = 1; $i <= $value; $i++) {
                $commentCount = rand(1, env('SEED_COMMENTS_MAX', 8));
                for ($j = 0; $j < $commentCount; $j++) {
                    $this->create($i, $key);
                }
            }
        }
    }

    private function create($resourceId, $resourceType)
    {
        // Root comment
        $rootComment = Comment::factory()->create([
            'created_at' => $this->faker->dateTimeBetween("-16 month", "-14 month"),
            // 'updated_at' => $this->faker->dateTimeBetween('-12 month', "-10 month"),
        ]);
        CommentToResource::create([
            "comment_id" => $rootComment->id,
            "{$resourceType}_id" => $resourceId,
        ]);

        // Branch comments
        $chance = 60;
        if ($this->faker->boolean($chance)) {
            $this->createReplies($rootComment, $resourceId, $resourceType, $chance);
        }
    }

    private function createReplies($parentComment, $resourceId, $resourceType, $currentChance)
    {
        $replyCount = rand(1, 7);

        for ($i = 0; $i < $replyCount; $i++) {
            // 16 - 14
            // 12 - 10
            // 8 - 6
            // 4 - 2

            $dateShiftLeft = $currentChance / 5;
            $dateShiftRight = $currentChance / 5 - 2;

            $branchComment = Comment::factory()->create([
                'created_at' => $this->faker->dateTimeBetween("-{$dateShiftLeft} month", "-{$dateShiftRight} month"),
                // 'updated_at' => $this->faker->dateTimeBetween('-11 month', 'now'),
            ]);
            CommentToResource::create([
                "comment_id" => $branchComment->id,
                "{$resourceType}_id" => $resourceId,
                "reply_to" => $parentComment->id
            ]);

            if ($this->faker->boolean($currentChance - 20)) {
                $this->createReplies($branchComment, $resourceId, $resourceType, $currentChance - 20);
            }
        }
    }
}
