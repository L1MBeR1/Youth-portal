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
    //Route::get('userEvents', [EventController::class, 'getUserEvents']);
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'events'
], function () {
    Route::get('userEvents', [EventController::class, 'getUserEvents'])->withoutMiddleware('auth');
    Route::get('{id}', [EventController::class, 'getEventById'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'cities'
], function () {
    Route::get('', [EventController::class, 'getCities'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'countries'
], function () {
    Route::get('', [EventController::class, 'getCountries'])->withoutMiddleware('auth');
});