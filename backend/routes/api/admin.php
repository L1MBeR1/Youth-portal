<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;

Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'admin'
], function () {
    Route::get('hello', [AdminController::class, 'hello']);
});