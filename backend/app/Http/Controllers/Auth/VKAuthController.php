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
use Illuminate\Support\Facades\Http;


//команда для запуска ngrok - ngrok http http://localhost:8000 
class VKAuthController extends Controller
{
    function generateCodeVerifier($minLength, $maxLength) {
        $length = rand($minLength, $maxLength);
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
        $charactersLength = strlen($characters);
        $codeVerifier = '';
    
        for ($i = 0; $i < $length; $i++) {
            $codeVerifier .= $characters[rand(0, $charactersLength - 1)];
        }
    
        return $codeVerifier;
    }
    
    //Для тестирования без фронта 
    /*public function initiateVkAuth()
    {
        $codeVerifier = 'x15uja156VNy_6gI281TwJIf53qOKLhVDG05En3T-4vTJ8y-i7YbMYIx7sJjBtV8';
        $hashcode = hash('sha256', $codeVerifier, true);

        $codeChallenge = rtrim(strtr(base64_encode($hashcode), '+/', '-_'), '=');
        Log::info('hash', ['codeChallenge' => $codeChallenge]);
        
        $state = Str::random(16);
        Log::info('state', ['state' => $state]);

        $params = [
            'response_type' => 'code',
            'client_id' => env('VK_CLIENT_ID'),
            'redirect_uri' => env('VK_REDIRECT_URI'), 
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 's256', 
        ];

        $url = 'https://id.vk.com/authorize?' . http_build_query($params);
        return redirect($url);
    }*/

    
    public function initiateVkAuth()
    {
        // Генерация code_verifier
        $codeVerifier = $this->generateCodeVerifier(64,128);
        $hashcode = hash('sha256', $codeVerifier, true);

        // Кодирование в Base64 URL-safe
        $codeChallenge = rtrim(strtr(base64_encode($hashcode), '+/', '-_'), '=');
        Log::info('hash', ['codeChallenge' => $codeChallenge]);
        
        // Генерация state
        $state = Str::random(16);
        Log::info('state', ['state' => $state]);

        return response()->json([
            'status' => 'success',
            'code_verifier' => $codeVerifier,
            'code_challenge' => $codeChallenge,
            'state' => $state,
            'client_id' => env('VK_CLIENT_ID'),
            'redirect_uri' => env('VK_REDIRECT_URI'),
            'code_challenge_method' => 's256'
        ]);
    }


    public function handleVkAnswer(Request $request)
    {
        $code = $request->input('code');
        $deviceId = $request->input('device_id');
        $codeVerifier = $request->input('code_verifier');

        //$codeVerifier = 'x15uja156VNy_6gI281TwJIf53qOKLhVDG05En3T-4vTJ8y-i7YbMYIx7sJjBtV8';

        //$response = Http::asForm()->post('https://id.vk.com/oauth2/auth', [ //TODO расскоментировать в проде
        $response = Http::withOptions(['verify' => false])->asForm()->post('https://id.vk.com/oauth2/auth', [  //TODO закоментить в проде(только для разработки)
            'grant_type' => 'authorization_code',
            'code_verifier' => $codeVerifier,
            'redirect_uri' => env('VK_REDIRECT_URI'),
            'code' => $code,
            'client_id' => env('VK_CLIENT_ID'),
            'device_id' => $deviceId,      
            'state' => ($state = Str::random(16)),
        ]);

        // Проверяем ответ
        if ($response->successful()) {
            $tokens = $response->json();
            if (isset($tokens['state']) && $tokens['state'] !== $state) {
                return response()->json(['error' => 'Несоответствие состояний'], 400);
            }
            Log::info('Полученные токены:', $tokens);

            $accessToken = $tokens['access_token'];

            // Запрос данных о пользователе
            //TODO В проде убрать >withOptions(['verify' => false])
            $userResponse = Http::withToken($accessToken)->withOptions(['verify' => false])->get('https://api.vk.com/method/users.get', [
                'fields' => 'id,first_name,last_name,photo_200', // Указываем, какие поля хотим получить
                'v' => '5.131' // Версия API
            ]);

            if ($userResponse->successful()) {
                $userData = $userResponse->json();
                Log::info('Данные пользователя:', $userData);

                // Возвращаем данные о пользователе
                return response()->json($userData);
            } else {
                Log::error('Ошибка при получении данных о пользователе:', [
                    'status' => $userResponse->status(),
                    'body' => $userResponse->body(),
                ]);
                return response()->json(['error' => 'Failed to obtain user data'], 400);
            }
                return response()->json($tokens);
        } else {
            return response()->json(['error' => 'Не удалось получить токены'], 400);
        }
    }
    /*
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
                if ($user->wasRecentlyCreated) {
                    $user->assignRole('user');
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
                return redirect('/?token=' . $token . '&refresh_token=' . $refreshToken);



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
    }*/
        
}