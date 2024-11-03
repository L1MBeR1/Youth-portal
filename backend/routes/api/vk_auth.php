<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VKAuthController;

// Аутентификация VK
Route::group([
    'middleware' => ['api'],
    'prefix' => 'vk'
], function () {
    Route::get('auth', [VKAuthController::class, 'handleVkAnswer'])->name('vk.auth')->withoutMiddleware('auth');
    // Роут для обработки аутентификации (перенаправление или колбэк)
    Route::get('/', [VKAuthController::class, 'initiateVkAuth'])->name('vk.auth')->withoutMiddleware('auth');
    
});