<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::post('/getRolesAndPermissions', [AuthController::class, 'getRolesAndPermissions'])->middleware('auth:api');
});

// Защищенный маршрут только для администратора
Route::group([
    'middleware' => ['auth:api', 'role:Admin'],
    'prefix' => 'admin'
], function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
});