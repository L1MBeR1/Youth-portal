<?php

namespace App\Policies;

use App\Models\NewsRoleStatus;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class BlogRoleStatusPolicy
{
    public function create(User $user): bool
    {
        return $user->hasRole('user');
    }
    public function delete(User $user, NewsRoleStatus $news_role_status): bool
    {
        return $user->hasRole('admin') || $user->hasRole('moderator') || $user->hasRole('su');
    }

    public function changeStatus(User $user, NewsRoleStatus $news_role_status): bool
    {
        return $user->hasRole('admin|moderator|su');
    }

    public function getList(User $user): bool
    {
        return $user->hasRole('admin|moderator|su');
    }
}