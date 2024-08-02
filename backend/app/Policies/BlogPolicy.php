<?php

namespace App\Policies;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class BlogPolicy
{
   

    /**
     * Определяет может ли пользователь просматривать любой блог.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin|moderator|su');
    }

    public function search(User $user): bool
    {        
        return $user->hasRole('admin') || $user->hasRole('moderator') || $user->hasRole('su');
    }

    public function viewPublishedBlogs(User $user): bool
    {
        return true;
    }

    public function requestSpecificPublishedBlog(User $user, Blog $blog): bool
    {
        if ($blog->status === 'published') {
            return true;
        }

        return false;
    }

    public function requestSpecificBlog(User $user, Blog $blog): bool
    {
        if ($blog->status === 'published') {
            return true;
        }

        if (!$user) {
            return false;
        }

        if ($user->hasRole('admin|moderator|su') /*|| $user->hasRole('moderator') || $user->hasRole('su')*/){
            return true;
        }        

        if ($blog->author_id === $user->id) {
            return true;
        }

        return false;
    }


    public function viewOwnBlogs(User $user): bool
    {
        return $user->hasPermissionTo('view own blogs');
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
        return $user->hasRole('admin|moderator|su');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Blog $blog): bool
    {
        $isAdminOrModerator = $user->hasRole('admin|moderator|su');
        $isAuthorAndBlogger = $user->hasRole('blogger') && $user->id === $blog->author_id;

        return $isAdminOrModerator || $isAuthorAndBlogger;
    }
}