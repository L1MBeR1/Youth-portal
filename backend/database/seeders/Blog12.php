<?php

namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Database\Seeder;
use App\Models\CommentToResource;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Faker\Factory as FakerFactory;


class Blog12 extends Seeder
{
    private $faker;

    public function __construct()
    {
        $this->faker = FakerFactory::create();
    }
    public function run()
    {
        $blogId = 12; // ID ресурса (блог)

        // Создаем 50 комментариев для блога
        $comments = Comment::factory()->count(50)->create();

        // Привязываем комментарии к блогу
        foreach ($comments as $comment) {
            CommentToResource::create([
                'comment_id' => $comment->id,
                'blog_id' => $blogId,
            ]);
        }

        // Создаем структуру ответов
        $this->createReplies($comments);
    }

    private function createReplies($comments)
    {
        $commentCount = count($comments);

        foreach ($comments as $comment) {
            // Случайно выбираем, будет ли у текущего комментария ответ
            if ($this->faker->boolean(30)) {
                // Находим случайный комментарий, который будет ответом
                $replyTo = $comments->random()->id;

                // Устанавливаем reply_to для текущего комментария
                $comment = CommentToResource::where('comment_id', $comment->id)->first();
                $comment->update(['reply_to' => $replyTo]);
            }
        }
    }
}
