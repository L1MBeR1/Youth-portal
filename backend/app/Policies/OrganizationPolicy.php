<?php

namespace App\Policies;

use App\Models\Organization;
use App\Models\User;

class BlogPolicy
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
}