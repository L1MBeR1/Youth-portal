<?php 

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;

Route::group([
    'middleware' => ['api'],
    'prefix' => 'projects'
], function () {
    Route::get('', [ProjectController::class, 'getProjects'])->withoutMiddleware('auth');
    Route::get('{id}', [ProjectController::class, 'getProjectById'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'projects'
], function () {
    Route::post('', [ProjectController::class, 'store']);
    
    Route::delete('{id}', [ProjectController::class, 'destroy']);
    Route::put('{id}', [ProjectController::class, 'update']);
});

