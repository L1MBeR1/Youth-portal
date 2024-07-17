<?php

namespace App\Policies;

use App\Models\Podcast;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\Log;

class PodcastPolicy
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
    public function view(User $user, Podcast $podcast): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user)
    {
        return $user->hasRole('admin') || $user->hasRole('blogger');
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

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Podcast $podcast)
    {
        Log::info('Entering delete policy');

        // Администраторы и модераторы могут удалять любые подкасты
        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can delete podcast ' . $podcast->id);
            return true;
        }

        // Блогеры могут удалять только свои подкасты
        if ($user->hasRole('blogger') && $user->id === $podcast->author_id) {
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
