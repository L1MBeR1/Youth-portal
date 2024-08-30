<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function deleteAny(User $user): bool
    {
        return $user->hasRole('su');
    }
}
