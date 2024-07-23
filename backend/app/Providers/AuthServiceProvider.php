<?php
namespace App\Providers;

use App\Models\Blog;
use App\Models\News;
use App\Models\Comment;
use App\Models\Podcast;
use App\Models\Project;
use App\Policies\BlogPolicy;
use App\Policies\NewsPolicy;
use App\Policies\CommentPolicy;
use App\Policies\PodcastPolicy;
use App\Policies\ProjectPolicy;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Comment::class => CommentPolicy::class,
        Podcast::class => PodcastPolicy::class,
        Blog::class => BlogPolicy::class,
        News::class => NewsPolicy::class,
        Project::class => ProjectPolicy::class,
        Events::class => EventPolicy::class
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}