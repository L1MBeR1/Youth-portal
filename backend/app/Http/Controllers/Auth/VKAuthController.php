<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
// use Socialite;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VKAuthController extends Controller
{
    /*public function redirectToProvider()
    {
        Log::info('Redirecting to VKontakte provider'); // Логируем сообщение о перенаправлении
        return Socialite::driver('vkontakte')->stateless()->redirect();
    }*/

    public function handleProviderCallback()
    {
        Log::info('Handling VKontakte callback'); // Логируем сообщение о колбэке

        try {
            //$vkUser = Socialite::driver('vkontakte')->stateless()->user();
            $vkUser = Socialite::driver('vkontakte')->stateless()->setHttpClient(
                new \GuzzleHttp\Client(['verify' => false])
            )->user();
            

            // Логирование полученных данных
            Log::info('VK User:', (array)$vkUser);

            // Найти или создать пользователя в базе данных
            $user = User::firstOrCreate(
                ['email' => $vkUser->email],
                ['name' => $vkUser->name]
            );

            // Аутентификация пользователя
            Auth::login($user, true);

            // Возвращаем JSON-ответ
            return response()->json([
                'status' => 'success',
                'message' => 'User authenticated successfully',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Error during VKontakte authentication: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to authenticate user',
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
