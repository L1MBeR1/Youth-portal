<?php 

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BlogRoleStatusController;


Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'blog_role_status',
], function () {
    Log::info('test');
    Route::post('', [BlogRoleStatusController::class, 'store']); 
    Route::put('{id}/status', [BlogRoleStatusController::class, 'setStatus']);
    Route::delete('{id}', [BlogRoleStatusController::class, 'destroy']);
    Route::get('', [BlogRoleStatusController::class, 'getBlogRolesStatusList']);

});