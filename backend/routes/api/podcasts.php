<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PodcastController;


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