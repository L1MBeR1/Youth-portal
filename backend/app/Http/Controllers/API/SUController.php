<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreUserRequest;
use Spatie\Permission\Models\Permission;

class SUController extends Controller
{
    /**
     * Заблокировать пользователя
     * 
     * Блокировка пользователя в системе. 
     * 
     * @group SU
     * 
     * @bodyParam permissions array[] массив разрешений 
     * @authenticated
     * 
     */
    public function blockUser($id)
    {
        // $this->validateRequest($request, [
        //     'email' => 'nullable|string|max:255',
        //     'phone' => 'nullable|string|max:15',
        //     'user_id' => 'nullable|int|max:15',
        //     'roles' => 'required|array',
        //     'deleteMode' => 'boolean',
        // ]);
        if (!Auth::user()->hasRole('su|admin')) {
            return $this->errorResponse('Access denied', [], 403);
        }
        $user = null;

        // if ($request->input('user_id')) {
        //     $user = User::find($request->input('user_id'));
        // } elseif ($request->input('email')) {
        //     $user = User::where('email', $request->input('email'))->first();
        // } elseif ($request->input('phone')) {
        //     $user = User::where('phone', $request->input('phone'))->first();
        // }

        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->blocked_at = now();
        $user->save();

        return $this->successResponse([], 'Пользователь заблокирован');
    }

    public function unblockUser($id)
    {
        // $this->validateRequest($request, [
        //     'email' => 'nullable|string|max:255',
        //     'phone' => 'nullable|string|max:15',
        //     'user_id' => 'nullable|int|max:15',
        //     'roles' => 'required|array',
        //     'deleteMode' => 'boolean',
        // ]);
        $user = null;
        if (!Auth::user()->hasRole('su')) {
            return $this->errorResponse('Access denied', [], 403);
        }

        // if ($request->input('user_id')) {
        //     $user = User::find($request->input('user_id'));
        // } elseif ($request->input('email')) {
        //     $user = User::where('email', $request->input('email'))->first();
        // } elseif ($request->input('phone')) {
        //     $user = User::where('phone', $request->input('phone'))->first();
        // }

        $user = User::find($id);

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->blocked_at = null;
        $user->save();

        return $this->successResponse([], 'Пользователь разблокирован');
    }

    public function updateUserRoles(StoreUserRequest $request)
    {
        Log::info($request);
        $request->validated();

        $user = null;

        if ($request->input('user_id')) {
            $user = User::find($request->input('user_id'));
        } elseif ($request->input('email')) {
            $user = User::where('email', $request->input('email'))->first();
        } elseif ($request->input('phone')) {
            $user = User::where('phone', $request->input('phone'))->first();
        }

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $roles = $request->input('roles');

        if ($request->input('deleteMode')) {
            foreach ($roles as $role) {
                $user->removeRole($role);
            }
        } else {
            foreach ($roles as $role) {
                $user->assignRole($role);
            }
        }

        return $this->successResponse([], 'Roles updated successfully');
    }
}
