<?php 

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsRoleStatusController;


Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'news_role_status',
], function () {
    // Log::info('test');
    Route::post('', [NewsRoleStatusController::class, 'store']); 
    Route::put('{id}/status', [NewsRoleStatusController::class, 'setStatus']);
    Route::delete('{id}', [NewsRoleStatusController::class, 'destroy']);
    Route::get('', [NewsRoleStatusController::class, 'getNewsRolesStatusList']);

});