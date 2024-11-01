<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VKAuthController;

// Аутентификация VK
Route::group([
    'middleware' => ['api'],
    'prefix' => 'vk'
], function () {
    // Роут для обработки аутентификации (перенаправление или колбэк)
    Route::get('/', [VKAuthController::class, 'handleAuth'])->name('vk.auth')->withoutMiddleware('auth');
});