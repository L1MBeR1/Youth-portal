<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;


// Работа с событиями
Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'events'
], function () {
    Route::get('', [EventController::class, 'getEvents']);
    Route::post('', [EventController::class, 'store']);
    Route::delete('{id}', [EventController::class, 'destroy']);
    Route::put('{id}', [EventController::class, 'update']);
    Route::get('userEvents', [EventController::class, 'getUserEvents']);
});