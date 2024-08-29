<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\V1\BlogController;


Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'blogs'
], function () {
    Route::get('', [BlogController::class, 'list']);
});

Route::group([
    'middleware' => ['api'],
    'prefix' => 'blogs'
], function () {
    //
});