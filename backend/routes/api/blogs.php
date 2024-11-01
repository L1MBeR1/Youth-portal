<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogController;





Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'blogs'
], function () {
    Route::get('my', [BlogController::class, 'getOwnBlogs']); 
    // Route::get('published', [BlogController::class, 'getPublishedBlogs'])->withoutMiddleware('auth:api'); 
    Route::get('', [BlogController::class, 'getBlogs']);
    
    Route::get('/index', [BlogController::class, 'index']); 

    Route::post('', [BlogController::class, 'store']); 
    Route::post('drafts/{id}', [BlogController::class, 'createDraft']);
    Route::put('drafts/{id}', [BlogController::class, 'applyDraft']); 
    Route::post('{id}/like', [BlogController::class, 'likeBlog']); 

    Route::delete('{id}', [BlogController::class, 'destroy']); 

    Route::put('{id}', [BlogController::class, 'update']); 
    Route::put('{id}/status', [BlogController::class, 'setStatus']); 
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'blogs'
], function () {
    Route::get('popular/by_time', [BlogController::class, 'getPopularBlogsByTime'])->withoutMiddleware('auth');
    Route::get('popular', [BlogController::class, 'getPopularBlogs'])->withoutMiddleware('auth'); // Новый маршрут для популярных новостей
    Route::get('published', [BlogController::class, 'getPublishedBlogs'])->withoutMiddleware('auth'); 
    Route::get('tags/', [BlogController::class, 'getTags'])->withoutMiddleware('auth');
    Route::get('{id}', [BlogController::class, 'getBlogById'])->withoutMiddleware('auth'); 
});