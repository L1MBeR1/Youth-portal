<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;


Route::group([
    'middleware' => ['auth:api', 'role:admin'],
    'prefix' => 'permissions'
 ], function () {
    Route::get('', [AdminController::class, 'listPermissions']);
    Route::post('', [AdminController::class, 'createPermission']);
 });