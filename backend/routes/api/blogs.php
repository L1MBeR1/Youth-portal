<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;





Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'blogs'
], function () {
    Route::get('my', [BlogController::class, 'getOwnBlogs']); // для всех авторизованных  
    // Route::get('published', [BlogController::class, 'getPublishedBlogs'])->withoutMiddleware('auth:api'); // Все
    Route::get('', [BlogController::class, 'getBlogs']); // TODO: переименовать в поиск. Роли: админ, модератор, су.
    
    Route::get('/index', [BlogController::class, 'index']); // TODO: включен в другие методы.

    Route::post('', [BlogController::class, 'store']); // для всех авторизованных
    Route::post('{id}/like', [BlogController::class, 'likeBlog']); // для всех авторизованных

    Route::delete('{id}', [BlogController::class, 'destroy']);  // для всех авторизованных владельцев. для 

    Route::put('{id}', [BlogController::class, 'update']); // для всех авторизованных владельцев
    Route::put('{id}/status', [BlogController::class, 'setStatus']); // для всех авторизованных владельцев. для админов, модераторов, су
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'blogs'
], function () {
    Route::get('published', [BlogController::class, 'getPublishedBlogs'])->withoutMiddleware('auth'); // Все
    Route::get('tags/', [BlogController::class, 'getTags'])->withoutMiddleware('auth');
    Route::get('{id}', [BlogController::class, 'getBlogById'])->withoutMiddleware('auth'); // Для админов, модераторов, су. Если статус published, то для всех
});