<?php
namespace Database\Factories;

use App\Models\CommentToResource;
use App\Models\Comment;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentToResourceFactory extends Factory
{
    protected $model = CommentToResource::class;

    public function definition()
    {
        // Создаем новый комментарий с помощью фабрики
        $comment = Comment::factory()->create();

        // Выбираем случайный ресурс для привязки комментария
        $resourceType = $this->faker->randomElement(['blog', 'podcast', 'news']);
        $resourceId = $this->faker->numberBetween(1, 50); // Замените на вашу логику для выбора ID ресурса

        return [
            'comment_id' => $comment->id,
            $resourceType . '_id' => $resourceId,
        ];
    }
}
