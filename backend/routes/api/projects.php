<?php 

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;


Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'projects'
], function () {
    // Log::info('test');
    Route::get('', [ProjectController::class, 'getProjects']);
    Route::get('{id}', [ProjectController::class, 'getProjectById']);
    Route::post('', [ProjectController::class, 'store']);
    
    Route::delete('{id}', [ProjectController::class, 'destroy']);
    Route::put('{id}', [ProjectController::class, 'update']);
});