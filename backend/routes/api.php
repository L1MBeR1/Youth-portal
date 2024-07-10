<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\Auth\VKAuthController;


// Аутентификация
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::get('profile', [AuthController::class, 'getProfile'])->middleware('auth:api');
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions'])->middleware('auth:api');
});


// Администрирование
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'admin'
], function () {
    Route::get('hello', [AdminController::class, 'hello']);
    Route::get('users', [AdminController::class, 'listUsers']);
    Route::get('blogs', [AdminController::class, 'listBlogs']);
    Route::get('users/{user_id}/blogs', [AdminController::class, 'listBlogsByUserId']);
    Route::post('users/{user_id}/roles/{role_name}', [AdminController::class, 'addRoleToUser']);
    Route::delete('users/{user_id}/roles/{role_name}', [AdminController::class, 'deleteRoleFromUser']);
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
    Route::get('all', [DocsController::class, 'index']);
});


// Работа с блогами
Route::group([
    'middleware' => ['auth:api', 'role:blogger'],
    'prefix' => 'blog'
], function () {
    Route::post('', [BlogController::class, 'store']);
});

// Работа с новостями
Route::group([
    'middleware' => ['auth:api', 'role:news_creator'],
    'prefix' => 'news'
], function () {
    Route::get('/index', [NewsController::class, 'index']);
    Route::get('/edit', [NewsController::class, 'edit']);
    Route::post('/create', [NewsController::class, 'store']);
    Route::post('/update/{id}', [NewsController::class, 'update']);
    Route::delete('/destroy/{id}', [NewsController::class, 'destroy']);
});

// Работа с подкастами
Route::group([
    'middleware' => ['auth:api', 'role:blogger'],
    'prefix' => 'podcasts'
], function () {
    Route::get('/index', [PodcastController::class, 'index']);
    Route::post('/create', [PodcastController::class, 'store']);
    Route::delete('/destroy/{id}', [PodcastController::class, 'destroy']);
});
