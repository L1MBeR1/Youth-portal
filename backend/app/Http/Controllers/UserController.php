<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserMetadata;

class UserController extends Controller
{
    public function listUsers()
    {
        $users = User::all();

        $response = [];
        foreach ($users as $index => $user) {
            $response[] = //[
                // 'id' => $user->id,
                /*'metadata' => */ $user->metadata;
            /*];*/
        }

        return $this->successResponse($response, '', 200);
    }

    public function addRoleToUser($user_id, $role_name)
    {
        $user = User::find($user_id);
        $role = $role_name;

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->assignRole($role);

        return $this->successResponse([], 'Role added successfully');
    }

    public function deleteRoleFromUser($user_id, $role_name){
        $user = User::find($user_id);
        $role = $role_name;

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->assignRole($role);

        return $this->successResponse([], 'Role added successfully');
    }
}
