<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;


Route::group([
    'middleware' => ['api'],
    'prefix' => 'auth'
], function () {
    
    Route::get('verify_email', [AuthController::class, 'verifyEmail'])->withoutMiddleware('auth');
    Route::get('change_password', [AuthController::class, 'changePassword'])->withoutMiddleware('auth');
    
    Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth');
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->withoutMiddleware('auth');

    Route::post('recover', [AuthController::class, 'recoverPassword'])->withoutMiddleware('auth');
    Route::post('set_new_password', [AuthController::class, 'setNewPassword'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'auth'
], function () {
    
    Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions']);
    Route::get('', [AuthController::class, 'getProfile']);
    Route::post('logout', [AuthController::class, 'logout']);
    
    
});