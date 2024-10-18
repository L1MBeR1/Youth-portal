<?php

namespace App\Policies;

use App\Models\Podcast;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class PodcastPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function setLikes(User $user){
        return $user->hasPermissionTo('set likes');
    }

    public function search(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('moderator') || $user->hasRole('su');
    }

    public function viewPublishedPodcasts(User $user): bool
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

    public function requestSpecificPodcast(User $user, Podcast $podcast): bool
    {
        if ($podcast->status === 'published') {
            return true;
        }


        if (!$user) {
            return false;
        }


        if ($user->hasRole('admin|moderator|su') /*|| $user->hasRole('moderator') || $user->hasRole('su')*/){
            return true;
        }        

       

        if ($podcast->author_id === $user->id) {
            return true;
        }

        return false;
    }

    public function viewOwnPodcasts(User $user): bool
    {
        return $user->hasPermissionTo('view own podcasts');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasRole('admin|su') || $user->hasRole('blogger');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Podcast $podcast)
    {
        Log::info('Checking update permission for user ' . $user->id);

        // Любой пользователь может обновлять только свои подкасты
        if ($user->id === $podcast->author_id) {
            Log::info('User ' . $user->id . ' is allowed to update their own podcast');
            return true;
        }

        Log::info('User ' . $user->id . ' is not allowed to update podcast ' . $podcast->id);
        return false;
    }

    public function updateStatus(User $user, Podcast $podcast): bool
    {
        Log::info('Checking update podcast status permission for user ' . $user->id);

        if ($user->hasRole('admin|moderator|su')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can update podcast status ' . $podcast->id);
            return true;
        }
        Log::info('User ' . $user->id . ' is not allowed to update podcast staaatus ' . $podcast->id);
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Podcast $podcast)
    {
        Log::info('Entering delete policy');

        // Администраторы и модераторы могут удалять любые подкасты
        if ($user->hasRole('admin|moderator|su')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can delete podcast ' . $podcast->id);
            return true;
        }

        // Блогеры могут удалять только свои подкасты
        if ($user->hasRole('blogger|su') && $user->id === $podcast->author_id) {
            Log::info('User ' . $user->id . ' is the author and can delete podcast ' . $podcast->id);
            return true;
        }

        Log::info('User ' . $user->id . ' does not have permission to delete podcast ' . $podcast->id);
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Podcast $podcast): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Podcast $podcast): bool
    {
        //
    }
}
