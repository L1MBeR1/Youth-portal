<?php

namespace Database\Seeders;

use App\Models\Comment;
use Illuminate\Database\Seeder;
use App\Models\CommentToResource;

class Blog13 extends Seeder
{
    public function run()
    {
        $blogId = 13; // ID ресурса (блог)

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
        $this->createNestedReplies($comments);
    }

    private function createNestedReplies($comments)
    {
        $commentMap = $comments->keyBy('id');
        $commentCount = count($comments);

        // Установим корневые комментарии
        $rootComments = $comments->random(10); // Например, 10 корневых комментариев

        foreach ($rootComments as $rootComment) {
            $this->createRepliesForComment($rootComment->id, $commentMap, 5); // Уровень 5
        }
    }

    private function createRepliesForComment($parentCommentId, $commentMap, $levelsLeft)
    {
        if ($levelsLeft <= 0) {
            return;
        }

        // Найти все комментарии, которые будут ответами на родительский комментарий
        $replies = $commentMap->except($parentCommentId)->random(rand(1, 3)); // 1-3 ответа на каждый комментарий

        foreach ($replies as $reply) {
            // Установить родительский комментарий
            CommentToResource::where('comment_id', $reply->id)->update(['reply_to' => $parentCommentId]);

            // Рекурсивно создавать ответы для этого комментария
            $this->createRepliesForComment($reply->id, $commentMap, $levelsLeft - 1);
        }
    }
}
