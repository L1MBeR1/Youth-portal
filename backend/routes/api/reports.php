<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;

Route::group([
    'middleware' => ['api'],
    'prefix' => 'reports'
], function () {
    // Route::get('', [ReportController::class, 'getReports'])->withoutMiddleware('auth');
    // Route::get('{id}', [ReportController::class, 'getReportById'])->withoutMiddleware('auth');
});

Route::group([
    'middleware' => ['auth:api'],
    'prefix' => 'reports'
], function () {
    Route::post('', [ReportController::class, 'store']);
    Route::get('', [ReportController::class, 'index']);
    Route::delete('{id}', [ReportController::class, 'destroy']);
    Route::put('{id}', [ReportController::class, 'update']);
});

