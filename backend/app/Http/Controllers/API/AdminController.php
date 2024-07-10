<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class AdminController extends Controller
{
    /**
     * Returns a JSON response with a message indicating that the user is an admin.
     */
    public function hello()
    {
        return response()->json(['message' => 'You are an admin!',], 200);
    }

    // Управление пользователями
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

        return response()->json($response, 200);
    }

    // public function createUser()
    // {
    //     //
    // }

    // public function updateUser($userId)
    // {
    //     //
    // }

    // public function deleteUser($userId)
    // {
    //     //
    // }

    // Управление контентом
    public function listBlogs()
    {
        $user = Auth::user();
        return $this->successResponse($user->blogs);
    }

    public function listBlogsByUserId($user_id)
    {
        $user = User::find($user_id);

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        return $this->successResponse($user->blogs);
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


    public function createBlog()
    {
        //
    }

    public function updateBlog($postId)
    {
        //
    }

    public function deleteBlog($postId)
    {
        //
    }

    // Настройки
    public function updateSettings()
    {
        //
    }
}
