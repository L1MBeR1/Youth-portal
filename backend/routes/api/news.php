<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'news'
], function () {
    Route::get('/index', [NewsController::class, 'index']);
    Route::get('my', [NewsController::class, 'getOwnNews']);
    Route::get('', [NewsController::class, 'getNews']);
    
    Route::post('', [NewsController::class, 'store']);
    Route::put('{id}', [NewsController::class, 'update']);
    Route::delete('{id}', [NewsController::class, 'destroy']);
    Route::put('{id}/status', [NewsController::class, 'updateStatus']);
    Route::post('like/{id}', [NewsController::class, 'likeNews']);
});
Route::group([
    'middleware' => ['api'],
    'prefix' => 'news'
], function () {
    Route::get('published', [NewsController::class, 'getPublishedNews'])->withoutMiddleware('auth');
    Route::get('{id}', [NewsController::class, 'getNewsById'])->withoutMiddleware('auth');
});

