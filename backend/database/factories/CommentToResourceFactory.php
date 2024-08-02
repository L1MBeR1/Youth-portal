<?php

namespace Database\Factories;

use App\Models\CommentToResource;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Log;

class CommentToResourceFactory extends Factory
{
    protected $model = CommentToResource::class;
    public function definition()
    {
        // Создаем новый комментарий с помощью фабрики
        $comment = Comment::factory()->create();

        // Выбираем случайный ресурс для привязки комментария
        $resourceType = $this->faker->randomElement(['blog', 'podcast', 'news']);

        // 50 - макс. число ресурсов, заданное в сидерах
        $resourceId = $this->faker->numberBetween(1, 50);

        // $otherCommentIds = CommentToResource::where($resourceType . '_id', '>', -1)
        //     ->where('comment_id', '!=', $comment->id)
        //     ->pluck('comment_id')
        //     ->toArray();

        return [
            'comment_id' => $comment->id,
            $resourceType . '_id' => $resourceId,
            'reply_to' => null,
        ];
    }
}
