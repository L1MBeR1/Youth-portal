<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\API\SUController;
use Laravel\Ui\AuthCommand;

// Работа с пользователями
Route::group([
    'middleware' => ['api'],
    'prefix' => 'users'
], function () {
    Route::get('delete_account/', [UserController::class, 'deleteAccount'])->withoutMiddleware('auth');
    Route::get('{userId}', [UserController::class, 'getUserById'])->withoutMiddleware('auth');
    
});



Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'users'
], function () {
    Log::info('User management');
    Route::get('/check/nickname', [UserController::class, 'checkNickname']);
    Route::put('nickname', [UserController::class, 'updateNickname']);
    Route::get('', [UserController::class, 'listUsers']);
    Route::put('{user_id}', [UserController::class, 'updateProfile']);
    Route::put('{user_id}/password', [AuthController::class, 'requestChangePassword']);
    Route::put('{user_id}/email', [AuthController::class, 'changeEmail']);
    Route::post('roles', [UserController::class, 'updateUserRoles']);
    Route::delete('{user_id}/roles/{role_name}', [UserController::class, 'deleteRoleFromUser']);
    Route::delete('{user_id}', [UserController::class, 'deleteUser']);
    Route::patch('{user_id}/block', [SUController::class, 'blockUser']);
    Route::patch('{user_id}/unblock', [SUController::class, 'unblockUser']);
    
});
