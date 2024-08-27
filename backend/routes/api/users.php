<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\SUController;

// Работа с пользователями
Route::group([
    'middleware' => ['api'],
    'prefix' => 'users'
], function () {
    Route::get('{userId}', [UserController::class, 'getUserById'])->withoutMiddleware('auth');
    
});



Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'users'
], function () {
    Route::get('', [UserController::class, 'listUsers']);
    Route::put('{user_id}', [UserController::class, 'updateProfile']);
    Route::get('profile', [UserController::class, 'getProfile']);
    Route::post('roles', [UserController::class, 'updateUserRoles']);
    Route::delete('{user_id}/roles/{role_name}', [UserController::class, 'deleteRoleFromUser']);
    Route::delete('{user_id}', [UserController::class, 'deleteUser']);
    Route::patch('{user_id}/block', [SUController::class, 'blockUser']);
    Route::patch('{user_id}/unblock', [SUController::class, 'unblockUser']);
});
