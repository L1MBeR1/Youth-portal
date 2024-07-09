<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Blog;
use App\Models\Article;

class CreateBlogWithComment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'blog:create-with-comment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Создание блога и добавление комментария';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Создание блога
        $blog = Blog::create([
            'title' => 'My First Blog',
            'body' => 'This is the body of my first blog.',
        ]);

        // $blog = Blog::find(1);

        // Добавление комментария к блогу
        $blog->comments()->create([
            'author' => 'John Doe',
            'body' => 'This is a comment on the blog.',
        ]);


        $this->info('Блог и комментарий успешно созданы.');

        return 0;
    }
}
