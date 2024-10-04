<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PodcastController;

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'podcasts'
], function () {
    Route::get('/my', [PodcastController::class, 'getOwnPodcasts']);
    Route::get('', [PodcastController::class, 'getPodcasts']);
    Route::get('/index', [PodcastController::class, 'index']);
    Route::post('', [PodcastController::class, 'store']);
    Route::post('drafts/{id}', [PodcastController::class, 'createDraft']);
    Route::put('drafts/{id}', [PodcastController::class, 'applyDraft']); 
    Route::delete('{id}', [PodcastController::class, 'destroy']);
    Route::put('{id}', [PodcastController::class, 'update']);
    Route::put('{id}/status', [PodcastController::class, 'updateStatus']);
    Route::post('like/{id}', [PodcastController::class, 'likePodcast']);
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'podcasts'
], function () {
    Route::get('published', [PodcastController::class, 'getPublishedPodcasts'])->withoutMiddleware('auth');
    Route::get('tags/', [PodcastController::class, 'getTags'])->withoutMiddleware('auth');
    Route::get('{id}', [PodcastController::class, 'getPodcastById'])->withoutMiddleware('auth');
});
