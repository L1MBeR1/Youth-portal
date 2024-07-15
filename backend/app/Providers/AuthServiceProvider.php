<?php
namespace App\Providers;

use App\Models\Comment;
use App\Policies\CommentPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Comment::class => CommentPolicy::class,
        Podcast::class => PodcastPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
