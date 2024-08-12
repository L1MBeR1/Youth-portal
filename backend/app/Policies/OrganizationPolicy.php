<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Facades\Log;


class OrganizationPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user)
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('su');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Organization $blog): bool
    {
        //TODO: Сделать роль organization_owner?
        //return $user->hasRole('admin') || $user->hasRole('su');
        return true;
        // return $user->id === $blog->author_id;
    }


    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('su');
    }

    public function updateStatus(User $user, Organization $organization): bool
    {
        Log::info('Checking update organization status permission for user ' . $user->id);

        if ($user->hasRole('admin|moderator|su')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can update organization status ' . $organization->id);
            return true;
        }
        Log::info('User ' . $user->id . ' is not allowed to update organization status ' . $organization->id);
        return false;
    }
}