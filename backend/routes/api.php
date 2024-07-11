<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DocsController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\CommentToResourceController;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\Auth\VKAuthController;
use App\Http\Controllers\UserController;

/**
 * 
 * POST   - Сделать новый ресурс                   - /префикс_коллеции/пустая_строка
 * PUT    - Обновить существующий ресурс полностью - /префикс_коллеции/{идентификатор}
 * PATCH  - Обновить существующий ресурс частично  - /префикс_коллеции/{идентификатор}
 * DELETE - Удалить ресурс                         - /префикс_коллеции/{идентификатор}
 * GET    - Получить ресурс                        - /префикс_коллеции/{идентификатор}
 * 
 */



// Аутентификация
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);//->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh']);//->middleware('auth:api');
    Route::get('profile', [AuthController::class, 'getProfile']);//->middleware('auth:api');
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions']);//->middleware('auth:api');
});


// Администрирование
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'admin'
], function () {
    Route::get('hello', [AdminController::class, 'hello']);
    Route::get('users', [UserController::class, 'listUsers']);
    Route::get('blogs', [BlogController::class, 'listBlogs']);
    // Route::get('users/{user_id}/blogs', [AdminController::class, 'listBlogsByUserId']);
    Route::post('users/{user_id}/roles/{role_name}', [AdminController::class, 'addRoleToUser']);
    Route::delete('users/{user_id}/roles/{role_name}', [AdminController::class, 'deleteRoleFromUser']);
});


// Работа с ролями
Route::group([
   'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'roles'
], function () {
    Route::get('', [AdminController::class, 'listRoles']);
   Route::post('', [AdminController::class, 'createRole']);
   Route::post('{role_name}', [AdminController::class, 'AddPermissionsToRole']); 
});

// Работа с разрешениями
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'permissions'
 ], function () {
    Route::get('', [AdminController::class, 'listPermissions']);
    Route::post('', [AdminController::class, 'createPermission']);
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
    'middleware' => ['auth:api', 'role:blogger|admin'],
    'prefix' => 'blogs'
], function () {
    Route::get('', [BlogController::class, 'listBlogs']);
    // Route::get('', [AdminController::class, 'listBlogsByUserId']);
    Route::post('', [BlogController::class, 'store']);
    Route::get('/index', [BlogController::class, 'index']);
    Route::delete('{id}', [BlogController::class, 'destroy']);
});

// Работа с новостями
Route::group([
    'middleware' => ['auth:api', 'role:news_creator'],
    'prefix' => 'news'
], function () {
     // Route::get('/edit', [NewsController::class, 'edit']);
     Route::post('', [NewsController::class, 'store']);
     Route::put('{id}', [NewsController::class, 'update']);
     Route::delete('{id}', [NewsController::class, 'destroy']);
});

// Работа с подкастами
Route::group([
    'middleware' => ['auth:api', 'role:blogger'],
    'prefix' => 'podcasts'
], function () {
    Route::get('/index', [PodcastController::class, 'index']);
    Route::post('', [PodcastController::class, 'store']);
    Route::delete('{id}', [PodcastController::class, 'destroy']);
});

// Работа с комментариями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'comments'
], function () {
    Route::get('/index', [CommentController::class, 'index']);
    Route::post('/create/{resource_type}/{resource_id}', [CommentController::class, 'store']);
    Route::delete('/destroy/{id}', [CommentController::class, 'destroy']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);

});
