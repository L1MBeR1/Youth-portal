<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\SUController;

// Работа с пользователями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'users'
], function () {
    Route::get('', [UserController::class, 'listUsers']);
    Route::post('roles', [UserController::class, 'updateUserRoles']);
    Route::delete('{user_id}/roles/{role_name}', [UserController::class, 'deleteRoleFromUser']);
    Route::patch('{user_id}/block', [SUController::class, 'blockUser']);
    Route::patch('{user_id}/unblock', [SUController::class, 'unblockUser']);
});
