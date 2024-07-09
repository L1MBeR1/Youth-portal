<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\Auth\VKAuthController;


// Аутентификация
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('/refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('/profile', [AuthController::class, 'profile'])->middleware('auth:api');
    Route::post('/updateProfile', [AuthController::class, 'updateProfile']);
    Route::post('/getRolesAndPermissions', [AuthController::class, 'getRolesAndPermissions'])->middleware('auth:api');
});


// Администрирование
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'admin'
], function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard']);
});


// Прокси (временно, пока нет SSL)
Route::group([
    'middleware' => 'api',
    'prefix' => 'proxy'
], function () {
    Route::get('/vk', [ProxyController::class, 'proxyToVk']);
});


// Аутентификация VK
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth/vkontakte'
], function () {
    //Route::post('/', [VKAuthController::class, 'redirectToProvider']);
    Route::get('/callback', [VKAuthController::class, 'handleProviderCallback']);
});


// Маршруты для VK
// Route::post('auth/vkontakte', [VKAuthController::class, 'redirectToProvider']);
// Route::get('auth/vkontakte/callback', [VKAuthController::class, 'handleProviderCallback']);


// Документация
Route::group([
    'middleware' => 'api',
    'prefix' => 'docs'
], function () {
    Route::get('/all', [DocsController::class, 'index']);
});