<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;

use App\Http\Controllers\API\AudioProxyController;

Route::group([
    'middleware' => ['api'],
    'prefix' => 'proxy'
], function () {
    Route::get('audio', [AudioProxyController::class, 'getContent'])->withoutMiddleware('auth');
});

