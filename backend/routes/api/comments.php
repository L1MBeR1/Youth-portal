<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CommentController;

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