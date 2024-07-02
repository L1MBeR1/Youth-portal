<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\VKAuthController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('auth/vkontakte', [VKAuthController::class, 'redirectToProvider'])->name('vkontakte.login');
Route::get('auth/vkontakte/callback', [VKAuthController::class, 'handleProviderCallback']);

Auth::routes();