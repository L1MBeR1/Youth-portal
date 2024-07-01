<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use App\Http\Controllers\Auth\VKAuthController;

Route::get('auth/vkontakte', [VKAuthController::class, 'redirectToProvider'])->name('vkontakte.login');
Route::get('auth/vkontakte/callback', [VKAuthController::class, 'handleProviderCallback']);

