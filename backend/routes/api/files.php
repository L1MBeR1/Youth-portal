<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FileSystems\FileController;

Route::group([
    'middleware' => ['api'],
    'prefix' => 'files'
], function () {
    Route::post('{content_type}/{content_id}/', [FileController::class, 'upload'])->withoutMiddleware('auth');
    Route::get('{content_type}/{content_id}/{filename}', [FileController::class, 'download'])->withoutMiddleware('auth');
    Route::put('{content_type}/{content_id}/{filename}', [FileController::class, 'update'])->withoutMiddleware('auth');
    Route::delete('{content_type}/{content_id}/{filename}', [FileController::class, 'delete'])->withoutMiddleware('auth');
});
