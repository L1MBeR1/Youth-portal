<?php

// use App\Models\Project;
// use App\Models\Organization;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SUController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PodcastController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\Auth\VKAuthController;
use App\Http\Controllers\OrganizationController;
use App\Models\News;

// use App\Http\Controllers\CommentToResourceController;

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
    'middleware' => ['api'],
    'prefix' => 'auth'
], function () {
    Route::post('register', [AuthController::class, 'register'])->withoutMiddleware('auth');
    Route::post('login', [AuthController::class, 'login'])->withoutMiddleware('auth');
    Route::get('verify_email', [AuthController::class, 'verifyEmail'])->withoutMiddleware('auth');
    // Route::post('logout', [AuthController::class, 'logout']);
    // Route::post('refresh', [AuthController::class, 'refresh']);
    // Route::get('profile', [AuthController::class, 'getProfile']);
    // Route::put('profile', [AuthController::class, 'updateProfile']);
    // Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions']);
});
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'auth'
], function () {
    // Route::post('register', [AuthController::class, 'register']);
    // Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    // Route::get('verify_email', [AuthController::class, 'verifyEmail']);
    Route::get('profile', [AuthController::class, 'getProfile']);
    Route::put('profile', [AuthController::class, 'updateProfile']);
    Route::get('roles_permissions', [AuthController::class, 'getRolesAndPermissions']);
});


// Администрирование
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'admin'
], function () {
    Route::get('hello', [AdminController::class, 'hello']);
});

// Супер Администрирование
// Route::group([
//     'middleware' => ['auth:api'],
//     'prefix' => 'admin'
// ], function () {
//     Route::get('hello', [SUController::class, 'hello']);
// });



// Работа с организациями
Route::group([
   'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'organizations'
], function () {
    Route::get('', [AdminController::class, 'getOrganizations']);
});



// Работа с пользователями
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'users'
], function () {
    Route::get('', [UserController::class, 'listUsers']);
    Route::post('roles', [UserController::class, 'updateUserRoles']);
    Route::delete('{user_id}/roles/{role_name}', [UserController::class, 'deleteRoleFromUser']);
    Route::patch('{user_id}/block', [SUController::class, 'blockUser']);
});

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'users'
], function () {
    // Route::get('', [UserController::class, 'listUsers']);
    // Route::post('roles', [UserController::class, 'updateUserRoles']);
    // Route::delete('{user_id}/roles/{role_name}', [UserController::class, 'deleteRoleFromUser']);
    Route::patch('{user_id}/block', [SUController::class, 'blockUser']);
    Route::patch('{user_id}/unblock', [SUController::class, 'unblockUser']);
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





// Работа с блогами
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'blogs'
], function () {
    Route::get('old', [BlogController::class, 'listBlogs']);
    Route::get('my', [BlogController::class, 'getOwnBlogs']);
    Route::get('published', [BlogController::class, 'getPublishedBlogs']);
    Route::get('', [BlogController::class, 'getBlogs']);
    Route::get('{id}', [BlogController::class, 'getBlogById']);
    Route::post('', [BlogController::class, 'store']);
    Route::get('/index', [BlogController::class, 'index']);
    Route::delete('{id}', [BlogController::class, 'destroy']);
    Route::put('{id}', [BlogController::class, 'update']);
    Route::put('{id}/status', [BlogController::class, 'setStatus']);
    Route::post('{id}/like', [BlogController::class, 'likeBlog']);
});



// Работа с новостями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'news'
], function () {
     Route::get('/index', [NewsController::class, 'index']);
     Route::get('my', [NewsController::class, 'getOwnNews']);
    Route::get('published', [NewsController::class, 'getPublishedNews']);
     Route::get('', [NewsController::class, 'getNews']);
     Route::post('', [NewsController::class, 'store']);
     Route::put('{id}', [NewsController::class, 'update']);
     Route::delete('{id}', [NewsController::class, 'destroy']);
     Route::put('{id}/status', [NewsController::class, 'updateStatus']);
     Route::post('like/{id}', [NewsController::class, 'likeNews']);


});



// Работа с подкастами
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'podcasts'
], function () {
    Route::get('my', [PodcastController::class, 'getOwnPodcasts']);
    Route::get('published', [PodcastController::class, 'getPublishedPodcasts']);
    Route::get('', [PodcastController::class, 'getPodcasts']);
    Route::get('/index', [PodcastController::class, 'index']);
    Route::post('', [PodcastController::class, 'store']);
    Route::delete('{id}', [PodcastController::class, 'destroy']);
    Route::put('{id}', [PodcastController::class, 'update']);
    Route::put('{id}/status', [PodcastController::class, 'updateStatus']);
    Route::post('like/{id}', [PodcastController::class, 'likePodcast']);
});



// Работа с комментариями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'comments'
], function () {
    Route::get('/index', [CommentController::class, 'index']);
    Route::post('/{resource_type}/{resource_id}', [CommentController::class, 'store']);
    Route::delete('{id}', [CommentController::class, 'destroy']);
    Route::put('{id}', [CommentController::class, 'update']);
    Route::get('/{type}/{id}', [CommentController::class, 'getForContent']);
});



// Работа с событиями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'events'
], function () {
    Route::get('', [EventController::class, 'getEvents']);
    Route::post('', [EventController::class, 'store']);
    Route::delete('{id}', [EventController::class, 'destroy']);
    Route::put('{id}', [EventController::class, 'update']);
});



// Работа с проектами
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'projects'
], function () {
    // Log::info('test');
    Route::get('', [ProjectController::class, 'getProjects']);
    // Route::get('/index', [ProjectController::class, 'index']);
    Route::post('', [ProjectController::class, 'store']);
    
    Route::delete('{id}', [ProjectController::class, 'destroy']);
    Route::put('{id}', [ProjectController::class, 'update']);
});

// Работа с организациями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'organizations'
], function () {
    Route::get('', [OrganizationController::class, 'getOrganizations']);
    Route::post('', [OrganizationController::class, 'store']);
    Route::put('{id}', [OrganizationController::class, 'update']);
    Route::delete('{id}', [OrganizationController::class, 'destroy']);
});