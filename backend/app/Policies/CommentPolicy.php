<?php

namespace App\Policies;

use App\Models\Comment;
use App\Models\User;
use App\Models\Blog;
use App\Models\News;
use App\Models\Podcast;
use Illuminate\Auth\Access\Response;
use App\Models\CommentToResource;
use Illuminate\Support\Facades\Log;

class CommentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    public function setLikes(User $user){
        return $user->hasPermissionTo('set likes');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Comment $comment): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {

    }

    public function createComment(User $user, $resource_type, $resource_id): bool
    {
        // Гости не могут создавать комментарии
        if ($user->hasRole('guest')) {
            return false;
        }
        return true;

    }

    public function createReply(User $user, Comment $comment): bool
    {
        return !$user->hasRole('guest');
    }


    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Comment $comment)
    {
        if ($user->hasRole('guest')){
            return false;
        }
        // Only the author of the comment can update it
        return $user->id === $comment->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Comment $comment)
    {
        // Гости не могут удалять комментарии
        if ($user->hasRole('guest')){
            return false;
        }
        // Администраторы и модераторы могут удалять любые комментарии
        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            return true;
        }

        // Блогеры могут удалять комментарии только в своих блогах и подкастах
        if ($user->hasRole('blogger') || $user->hasRole('news_creator')) {
            $commentToResource = CommentToResource::where('comment_id', $comment->id)->first();
            Log::info($commentToResource);
            if ($commentToResource) {
                if ($commentToResource->blog_id !== null) {
                    $resource = Blog::find($commentToResource->blog_id);
                } elseif ($commentToResource->podcast_id !== null) {
                    $resource = Podcast::find($commentToResource->podcast_id);
                } elseif ($commentToResource->news_id !== null) {
                    $resource = News::find($commentToResource->news_id);
                } else {
                    $resource = null;
                }
                Log::info($resource);

                if ($resource && $resource->author_id === $user->id) {
                    return true;
                }
            }
        }

        // Обычные пользователи могут удалять только свои собственные комментарии
        return $comment->user_id === $user->id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Comment $comment): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Comment $comment): bool
    {
        //
    }
}
