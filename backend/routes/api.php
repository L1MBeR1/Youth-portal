<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProxyController;
use App\Http\Controllers\Auth\VKAuthController;


/**
 * 
 * POST   - Сделать новый ресурс                   - /префикс_коллеции/пустая_строка
 * PUT    - Обновить существующий ресурс полностью - /префикс_коллеции/{идентификатор}
 * PATCH  - Обновить существующий ресурс частично  - /префикс_коллеции/{идентификатор}
 * DELETE - Удалить ресурс                         - /префикс_коллеции/{идентификатор}
 * GET    - Получить ресурс                        - /префикс_коллеции/{идентификатор}
 * 
 */

 
require __DIR__ . '/api/admin.php';
require __DIR__ . '/api/auth.php';
require __DIR__ . '/api/blogs.php';
require __DIR__ . '/api/comments.php';
require __DIR__ . '/api/events.php';
require __DIR__ . '/api/news.php';
require __DIR__ . '/api/organizations.php';
require __DIR__ . '/api/permissions.php';
require __DIR__ . '/api/podcasts.php';
require __DIR__ . '/api/projects.php';
require __DIR__ . '/api/roles.php';
require __DIR__ . '/api/users.php';




// Супер Администрирование
// Route::group([
//     'middleware' => ['auth:api'],
//     'prefix' => 'admin'
// ], function () {
//     Route::get('hello', [SUController::class, 'hello']);
// });


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
