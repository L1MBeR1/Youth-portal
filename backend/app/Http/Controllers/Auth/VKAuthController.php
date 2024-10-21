<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User; 
use App\Models\SocialAccount; 
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

//команда для запуска ngrok - ngrok http http://localhost:8000 
class VKAuthController extends Controller
{
    public function handleAuth(Request $request)
{
    Log::info('Handling VKontakte authentication');

    // Проверяем, есть ли код аутентификации
    if ($request->has('code')) {
        try {
            // Получаем пользователя из ВК
            $vkUser  = Socialite::driver('vkontakte')->stateless()->setHttpClient(
                new \GuzzleHttp\Client(['verify' => false])
            )->user();

            Log::info('VK User:', (array)$vkUser );

            $user = User::firstOrCreate(
                ['email' => $vkUser ->email],
                [
                    'password' => 'password',
                    'phone' => null,
                ]
            );

            SocialAccount::updateOrCreate(
                ['user_id' => $user->id, 'provider' => 'vk'],
                ['provider_user_id' => $vkUser ->id]
            );

            UserMetadata::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $vkUser ->user['first_name'] ?? null,
                    'last_name' => $vkUser ->user['last_name'] ?? null,
                    'nickname' => $vkUser ->user['screen_name'] ?? null,
                    'profile_image_uri' => $vkUser ->user['photo_200'] ?? null, // URL изображения профиля
                ]
            );

            // Проверяем, если пользователь новый, то присваиваем роль
            if ($user->wasRecentlyCreated) {
                $user->roles()->attach(7);
            }

            Auth::login($user, true);

            return response()->json([
                'status' => 'success',
                'message' => 'User  authenticated successfully',
                'user' => $user,
            ]);
        } catch (\Exception $e) {
            Log::error('Error during VKontakte authentication: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to authenticate user',
            ], 500);
        }
    } else {
        // Перенаправление на страницу аутентификации ВК
        Log::info('Redirecting to VKontakte provider');
        return Socialite::driver('vkontakte')->stateless()->redirect();
    }
}

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}