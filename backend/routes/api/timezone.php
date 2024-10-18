<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TimezoneTestController;


Route::group([
    'middleware' => ['api'],
    'prefix' => 'test'
], function () {
    Route::get('/timezone', [TimezoneTestController::class, 'getTimezones'])->withoutMiddleware('auth');
    Route::post('/timezone', [TimezoneTestController::class, 'checkTimezones'])->withoutMiddleware('auth');

});
