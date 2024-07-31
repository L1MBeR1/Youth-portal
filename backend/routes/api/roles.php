<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AdminController;

// Работа с ролями
Route::group([
    'middleware' => ['auth:api', 'role:admin'],
     'prefix' => 'roles'
 ], function () {
     Route::get('', [AdminController::class, 'listRoles']);
    Route::post('', [AdminController::class, 'createRole']);
    Route::post('{role_name}', [AdminController::class, 'AddPermissionsToRole']); 
 });