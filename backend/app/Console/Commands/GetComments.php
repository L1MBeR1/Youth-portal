<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Blog;
use App\Models\Article;

class GetComments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'comments:get {model} {id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Получение комментариев для заданной модели и идентификатора, или всех комментариев, если идентификатор не указан';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $model = $this->argument('model');
        $id = $this->argument('id');

        $modelClass = null;
        switch ($model) {
            case 'blog':
                $modelClass = Blog::class;
                break;
            case 'article':
                $modelClass = Article::class;
                break;
            default:
                $this->error('Модель не найдена.');
                return 1;
        }

        if ($id) {
            $modelInstance = $modelClass::find($id);
            if (!$modelInstance) {
                $this->error('Запись не найдена.');
                return 1;
            }

            $comments = $modelInstance->comments;

            if ($comments->isEmpty()) {
                $this->info('Комментарии не найдены.');
                return 0;
            }

            foreach ($comments as $comment) {
                $this->displayComment($comment);
            }
        } else {
            $instances = $modelClass::with('comments')->get();

            if ($instances->isEmpty()) {
                $this->info('Записи не найдены.');
                return 0;
            }

            foreach ($instances as $instance) {
                $this->info("Комментарии для {$model} с ID {$instance->id}:");
                if ($instance->comments->isEmpty()) {
                    $this->info('Комментарии не найдены.');
                } else {
                    foreach ($instance->comments as $comment) {
                        $this->displayComment($comment);
                    }
                }
                $this->info('----------------------------------------');
            }
        }

        return 0;
    }

    /**
     * Display a single comment.
     *
     * @param $comment
     */
    protected function displayComment($comment)
    {
        $this->info("Author: {$comment->author}");
        $this->info("Body: {$comment->body}");
        $this->info("Created at: {$comment->created_at}");
        $this->info('----------------------------------------');
    }
}
