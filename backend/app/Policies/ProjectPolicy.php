<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Project;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Access\Response;

class ProjectPolicy
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
    public function view(User $user, Project $project): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        Log::info('Checking update permission for user ' . $user->id);

        if ($user->id === $project->author_id) {
            Log::info('User ' . $user->id . ' is allowed to update their own project');
            return true;
        }

        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can update project ' . $project->id);
            return true;
        }

        Log::info('User ' . $user->id . ' is not allowed to update project ' . $project->id);
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        Log::info('Entering delete project policy');

        if ($user->hasRole('admin') || $user->hasRole('moderator')) {
            Log::info('User ' . $user->id . ' is an admin or moderator and can delete projects ' . $projec->id);
            return true;
        }

        if ($user->hasRole('organization') && $user->id === $project->author_id) {
            Log::info('User ' . $user->id . ' is the author and can delete project ' . $project->id);
            return true;
        }

        Log::info('User ' . $user->id . ' does not have permission to delete project ' . $project->id);
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        //
    }
}
