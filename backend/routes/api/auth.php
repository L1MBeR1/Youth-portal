<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;


Route::group([
    'middleware' => ['api'],
    'prefix' => 'auth'
], function () {
    Log::info('z nen');
    Route::get('verify_email', [AuthController::class, 'verifyEmail'])->withoutMiddleware('auth');
    
    Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth');
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth');
    Route::post('refresh', [AuthController::class, 'refresh'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'auth'
], function () {
    Route::get('profile', [AuthController::class, 'getProfile']);
    Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions']);
    
    Route::post('logout', [AuthController::class, 'logout']);
    
    Route::put('profile', [AuthController::class, 'updateProfile']);
});