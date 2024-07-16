<?php

namespace App\Policies;

use App\Models\Blog;
use App\Models\User;

class BlogPolicy
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
    public function view(User $user, Blog $podcast): bool
    {
        //
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('blogger');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Blog $blog): bool
    {
        return $user->id === $blog->author_id;
    }

    /**
     * 
     */
    public function changeStatus(User $user, Blog $blog): bool
    {
        return $user->hasRole('admin') || $user->hasRole('moderator');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Blog $blog): bool
    {
        $isAdminOrModerator = $user->hasRole('admin') || $user->hasRole('moderator');
        $isAuthorAndBlogger = $user->hasRole('blogger') && $user->id === $blog->author_id;

        return $isAdminOrModerator || $isAuthorAndBlogger;
    }
}