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
        $resourceId = $this->faker->numberBetween(1, 50);

        // Получаем массив идентификаторов комментариев, кроме текущего комментария
        $otherCommentIds = Comment::where('id', '!=', $comment->id)->pluck('id')->toArray();

        return [
            'comment_id' => $comment->id,
            $resourceType . '_id' => $resourceId,
            'reply_to' => $this->faker->randomElement(array_merge([null, null, null], $otherCommentIds)),
        ];
    }
}
