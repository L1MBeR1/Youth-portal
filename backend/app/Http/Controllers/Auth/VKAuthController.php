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
use Illuminate\Support\Str;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

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
                $vkUser = Socialite::driver('vkontakte')->stateless()->setHttpClient(
                    new \GuzzleHttp\Client(['verify' => false])
                )->user();

                Log::info('VK User:', (array) $vkUser);

                $user = User::firstOrCreate(
                    ['email' => $vkUser->email],
                    [
                        'password' => 'password',
                        'phone' => null,
                    ]
                );

                SocialAccount::updateOrCreate(
                    ['user_id' => $user->id, 'provider' => 'vk'],
                    ['provider_user_id' => $vkUser->id]
                );

                UserMetadata::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'first_name' => $vkUser->user['first_name'] ?? null,
                        'last_name' => $vkUser->user['last_name'] ?? null,
                        'nickname' => $vkUser->user['screen_name'] ?? null,
                        'profile_image_uri' => $vkUser->user['photo_200'] ?? null, // URL изображения профиля //TODO: МБ скачать, но не сейчас
                    ]
                );

                // Проверяем, если пользователь новый, то присваиваем роль
                // TODO: Это работает через attach (в БД таблица models has roles)? $user->assignRole('guest');
                if ($user->wasRecentlyCreated) {
                    $user->roles()->attach(7); //TODO: Возможно, заменить на имя роли, чтобы не ломался код, при изменении ролей
                }

                Auth::login($user, true);


                // TODO: Перенести в ....., когда исправлю AuthController.
                $customPayload = [
                    'sub' => $user->id,
                    'iat' => now()->timestamp,
                    'exp' => now()->addMinutes(15)->timestamp,
                ];
        
                $payload = JWTAuth::factory()->customClaims($customPayload)->make();
                $token = JWTAuth::encode($payload)->get();
                $refreshToken = $this->generateRefreshToken($user);
                return $this->respondWithToken($token, $refreshToken);

                // return response()->json([
                //     // 'status' => 'success',
                //     'message' => 'User  authenticated successfully',
                //     'user' => $user,
                // ], 200);
            } catch (\Exception $e) {
                Log::error('Error during VKontakte authentication: ' . $e->getMessage());
                return response()->json([
                    // 'status' => 'error',
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


    // TODO: Позже сделаю класс или трейт
    protected function respondWithToken($token, $refreshToken = null)
    {
        $response = response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);


        if ($refreshToken) {
            $cookie = cookie(
                'refresh_token',
                $refreshToken,
                60 * 24 * 7,
                '/',
                null,
                false, // Secure
                true, // HttpOnly
                false, // Raw
                // 'Lax',
            );
            $response->withCookie($cookie);
        }

        return $response;
    }


    // TODO: Позже сделаю класс или трейт
    protected function generateRefreshToken($user, $ttl = 7 * 24 * 60 * 60)
    {
        $uuid = (string) Str::uuid();
        $expiresAt = now()->addSeconds($ttl)->timestamp;

        $refreshToken = base64_encode($uuid . '.' . $expiresAt);

        $user->remember_token = $refreshToken;
        $user->save();

        return $refreshToken;
    }
}