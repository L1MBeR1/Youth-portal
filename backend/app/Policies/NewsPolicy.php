<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Access\Response;


class NewsPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return true;
    }

    public function search(User $user): bool
    {        
        return $user->hasRole('admin') || $user->hasRole('moderator') || $user->hasRole('su');
    }

    public function viewPublishedNews(User $user): bool
    {
        return true;
    }

    public function viewOwnNews(User $user): bool
    {
        return $user->hasPermissionTo('view own news');
    }

    public function setLikes(User $user){
        return $user->hasPermissionTo('set likes');
    }

    public function requestSpecificNews(User $user, News $news): bool
    {
        if ($news->status === 'published') {
            return true;
        }

        
        if (!$user) {
            return false;
        }
        
        
        if ($user->hasRole('admin|moderator|su') /*|| $user->hasRole('moderator') || $user->hasRole('su')*/){
            return true;
        }   

        if ($news->author_id === $user->id) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     *
     * @param \App\Models\User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('news_creator');
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\News $news
     * @return bool
     */
    public function update(User $user, News $news): bool
    {
        Log::info('Checking update permission for user ' . $user->id);

        if ($user->id === $news->author_id) {
            Log::info('User ' . $user->id . ' is allowed to update their own news');
            return true;
        }

        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can update news ' . $news->id);
            return true;
        }

        Log::info('User ' . $user->id . ' is not allowed to update news ' . $news->id);
        return false;
    }

    public function updateStatus(User $user, News $news): bool
    {
        Log::info('Checking update news status permission for user ' . $user->id);

        if ($user->hasRole('admin|moderator|su')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can update news status ' . $news->id);
            return true;
        }
        Log::info('User ' . $user->id . ' is not allowed to update news staaatus ' . $news->id);
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param \App\Models\User $user
     * @param \App\Models\News $news
     * @return bool
     */
    public function delete(User $user, News $news): bool
    {
        Log::info('Entering delete news policy');

        if ($user->hasRole('admin|moderator|su')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can delete news ' . $news->id);
            return true;
        }

        if ($user->hasRole('news_creator') && $user->id === $news->author_id) {
            Log::info('User ' . $user->id . ' is the author and can delete news ' . $news->id);
            return true;
        }

        Log::info('User ' . $user->id . ' does not have permission to delete news ' . $news->id);
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, News $news): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, News $news): bool
    {
        //
    }

}
