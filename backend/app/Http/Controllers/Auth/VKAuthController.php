<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Socialite;
// use Laravel\Socialite\Facades\Socialite;


use App\Models\User;
use Illuminate\Support\Facades\Auth;

class VKAuthController extends Controller
{
    public function redirectToProvider()
    {
        return Socialite::driver('vkontakte')->redirect();
    }

    public function handleProviderCallback()
    {
        $vkUser = Socialite::driver('vkontakte')->user();

        // Найти или создать пользователя в базе данных
        $user = User::firstOrCreate(
            ['email' => $vkUser->email],
            ['name' => $vkUser->name]
        );

        // Аутентифицикация пользователя
        Auth::login($user, true);

        // Перенаправление пользователя на домашнюю страницу
        return redirect()->intended('/home');
    }
}
