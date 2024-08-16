<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Access\Response;

class EventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin|moderator|su');
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
     *
     * @param \App\Models\User $user
     * @return bool
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('organization');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Event $event): bool
    {
        // Log::info('Checking update permission for user ' . $user->id);

        if ($user->id === $event->author_id) {
            // Log::info('User ' . $user->id . ' is allowed to update their own events');
            return true;
        }

        if ($user->hasRole('admin|moderator')) {
            // Log::info('User ' . $user->id . ' is an admin or moderator and can update events ' . $event->id);
            return true;
        }

        // Log::info('User ' . $user->id . ' is not allowed to update events ' . $event->id);
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Event $event): bool
    {
        // Log::info('Entering delete event policy');

        if ($user->hasRole('admin|moderator')) {
            // Log::info('User ' . $user->id . ' is an admin or moderator and can delete event ' . $event->id);
            return true;
        }

        if ($user->hasRole('organization') && $user->id === $event->author_id) {
            // Log::info('User ' . $user->id . ' is the author and can delete event ' . $event->id);
            return true;
        }

        // Log::info('User ' . $user->id . ' does not have permission to delete event ' . $event->id);
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Event $event): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Event $event): bool
    {
        //
    }
}
