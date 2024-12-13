<?php

namespace App\Policies;

use App\Models\OrganizationRoleStatus;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class BlogRoleStatusPolicy
{
    public function create(User $user): bool
    {
        return !$user->hasRole('guest');
    }
    public function delete(User $user, OrganizationRoleStatus $organization_role_status): bool
    {
        return $user->hasRole('admin') || $user->hasRole('moderator') || $user->hasRole('su');
    }

    public function changeStatus(User $user, OrganizationRoleStatus $organization_role_status): bool
    {
        return $user->hasRole('admin|moderator|su');
    }

    public function getList(User $user): bool
    {
        return $user->hasRole('admin|moderator|su');
    }
}