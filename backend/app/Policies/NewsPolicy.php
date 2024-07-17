<?php

namespace App\Policies;

use App\Models\News;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class NewsPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasRole('admin') || $user->hasRole('news_creator');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, News $news)
    {
        Log::info('Checking update permission for user ' . $user->id);

        // Любой пользователь может обновлять только свои новости
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

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, News $news)
    {
        Log::info('Entering delete news policy');

        // Администраторы и модераторы могут удалять любые новости
        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can delete news ' . $news->id);
            return true;
        }

        // Блогеры могут удалять только свои новости
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
