<?php 

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrganizationRoleStatusController;


Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'organization_role_status',
], function () {
    Log::info('test');
    Route::post('', [OrganizationRoleStatusController::class, 'store']); 
    Route::put('{id}/status', [OrganizationRoleStatusController::class, 'setStatus']);
    Route::delete('{id}', [OrganizationRoleStatusController::class, 'destroy']);
    Route::get('', [OrganizationRoleStatusController::class, 'getOrganizationRolesStatusList']);

});