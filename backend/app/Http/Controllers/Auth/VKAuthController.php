<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
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


// !команда для запуска ngrok - ngrok http http://localhost:8000 
class VKAuthController extends Controller
{
    /**
     * Генерирует случайный код-подтверждение заданной длины.
     *
     * @param int $minLength Минимальная длина кода.
     * @param int $maxLength Максимальная длина кода.
     * @return string Случайно сгенерированный код-подтверждение, состоящий из букв, цифр и символов '-' и '_'.
     */
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

    /**
     * Генерирует случайное состояние заданной длины.
     *
     * @param int $minLength Минимальная длина состояния.
     * @param int $maxLength Максимальная длина состояния.
     * @return string Случайно сгенерированная строка фиксированной длины.
     */
    function generateRandomState($minLength, $maxLength) {
        $length = rand($minLength, $maxLength);   
        return Str::random($length);
    }
    
    // !!!Для тестирования без фронта!!!
    /*public function initiateVkAuth()
    {
        $codeVerifier = 'x15uja156VNy_6gI281TwJIf53qOKLhVDG05En3T-4vTJ8y-i7YbMYIx7sJjBtV8';
        $hashcode = hash('sha256', $codeVerifier, true);

        $codeChallenge = rtrim(strtr(base64_encode($hashcode), '+/', '-_'), '=');
        Log::info('hash', ['codeChallenge' => $codeChallenge]);
        
        $state = $this->generateRandomState(64, 128);
        Log::info('state', ['state' => $state]);

        $params = [
            'response_type' => 'code',
            'client_id' => env('VK_CLIENT_ID'),
            'scope' => 'email',
            'redirect_uri' => env('VK_REDIRECT_URI'),
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 's256',
        ];

        $url = 'https://id.vk.com/authorize?' . http_build_query($params);
        return redirect($url);
    }*/

    
    /**
     * Инициализировать аутентификацию через VK.
     *
     * Генерирует код-подтверждение и состояние для аутентификации, кодирует код-подтверждение в формат Base64 URL-safe
     * и возвращает JSON-ответ с необходимыми данными для начала процесса аутентификации.
     *
     * @group Аутентификация VK
     *
     * @return \Illuminate\Http\JsonResponse JSON-ответ с параметрами:
     *     @response 200 {
     *         "status": "success",
     *         "code_verifier": "string", // Случайно сгенерированный код-подтверждение
     *         "code_challenge": "string", // Код-подтверждение, закодированный в Base64 URL-safe
     *         "state": "string",           // Случайно сгенерированное состояние
     *         "client_id": "string",       // Идентификатор клиента VK
     *         "code_challenge_method": "s256" // Метод кодирования
     *     }
     */
    // !!!Для тестирования с фронтом и продакшена!!!
    public function initiateVkAuth()
    {
        // Генерация code_verifier
        $codeVerifier = $this->generateCodeVerifier(64,128);
        $hashcode = hash('sha256', $codeVerifier, true);

        // Кодирование в Base64 URL-safe
        $codeChallenge = rtrim(strtr(base64_encode($hashcode), '+/', '-_'), '=');
        Log::info('hash', ['codeChallenge' => $codeChallenge]);
        
        // Генерация state
        $state = $this->generateRandomState(64, 128);
        Log::info('state', ['state' => $state]);

        return response()->json([
            'status' => 'success',
            'code_verifier' => $codeVerifier,
            'code_challenge' => $codeChallenge,
            'state' => $state,
            'client_id' => env('VK_CLIENT_ID'),
            'code_challenge_method' => 's256'
        ]);
    }

    /**
     * Обработать ответ от VK после аутентификации.
     *
     * Принимает код авторизации и другие параметры, отправляет запрос на получение токенов,
     * затем запрашивает данные о пользователе и сохраняет их в базе данных.
     *
     * @group Аутентификация VK
     *
     * @param \Illuminate\Http\Request $request Входящий запрос с параметрами:
     *     @bodyParam code string required Код авторизации, полученный от VK.
     *     @bodyParam device_id string required Идентификатор устройства.
     *     @bodyParam code_verifier string required Код-подтверждение, использованный при инициализации аутентификации.
     */
    public function handleVkAnswer(Request $request)
    {
        $code = $request->input('code');
        $deviceId = $request->input('device_id');
        $codeVerifier = $request->input('code_verifier');

        //$codeVerifier = 'x15uja156VNy_6gI281TwJIf53qOKLhVDG05En3T-4vTJ8y-i7YbMYIx7sJjBtV8'; // !Для тестов без фронта

        $response = Http::asForm()->post('https://id.vk.com/oauth2/auth', [ // !Для продакшена
        //$response = Http::withOptions(['verify' => false])->asForm()->post('https://id.vk.com/oauth2/auth', [  // !Для локального тестирования
            'grant_type' => 'authorization_code',
            'code_verifier' => $codeVerifier,
            'redirect_uri' => env('VK_REDIRECT_URI'),
            'code' => $code,
            'client_id' => env('VK_CLIENT_ID'),
            'device_id' => $deviceId,
            'state' => ($state = $this->generateRandomState(64, 128)),
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
            //$userResponse = Http::withOptions(['verify' => false])->post('https://id.vk.com/oauth2/user_info', [//! Для локального тестирования
            $userResponse = Http::post('https://id.vk.com/oauth2/user_info', [ // ! Для продакшенна
                'client_id' => env('VK_CLIENT_ID'),
                'access_token' => $accessToken,
            ]);

            if ($userResponse->successful()) {
                $userData = $userResponse->json()['user'];

                // Проверяем наличие vk_id в SocialAccount
                $socialAccount = SocialAccount::where('provider_user_id', $userData['user_id'])->first();

                if (!$socialAccount) {
                    // Если аккаунта нет, создаем пользователя
                    $user = User::firstOrCreate(
                        [
                            'password' => bcrypt('password'),
                        ]
                    );

                    // Создаем запись в SocialAccount
                    SocialAccount::create([
                        'user_id' => $user->id,
                        'provider' => 'vk',
                        'provider_user_id' => $userData['user_id'],
                    ]);

                    // Создаем запись в UserMetadata
                    $nickname = $this->getRandomNickname();
                    UserMetadata::create([
                        'user_id' => $user->id,
                        'nickname' => $nickname,
                        'first_name' => $userData['first_name'] ?? null,
                        'last_name' => $userData['last_name'] ?? null,
                        'profile_image_uri' => $userData['avatar'] ?? null,
                        'gender' => $userData['sex'] === 1 ? 'f' : ($userData['sex'] === 2 ? 'm' : null),
                        'birthday' => !empty($userData['birthday']) ? Carbon::createFromFormat('d.m.Y', $userData['birthday'])->format('Y-m-d') : null,
                    ]);

                    // Присваиваем роль
                    $user->assignRole('user');
                    Auth::login($user, true);
                } else {
                    // Если SocialAccount уже существует, обновляем данные в UserMetadata
                    $userMetadata = UserMetadata::where('user_id', $socialAccount->user_id)->first();

                    if ($userMetadata) {
                        $userMetadata->first_name = $userData['first_name'] ?? null;
                        $userMetadata->last_name = $userData['last_name'] ?? null;
                        $userMetadata->profile_image_uri = $userData['avatar'] ?? null; 
                        $userMetadata->gender = $userData['sex'] === 1 ? 'f' : ($userData['sex'] === 2 ? 'm' : null);
                        $userMetadata->birthday = !empty($userData['birthday']) ? Carbon::createFromFormat('d.m.Y', $userData['birthday'])->format('Y-m-d') : null;
                        $userMetadata->save();
                    }

                    // Вход в систему, если пользователь уже существует
                    $user = User::find($socialAccount->user_id);
                    Auth::login($user, true);
                }

                // Генерация токена
                $customPayload = [
                    'sub' => $user->id,
                    'iat' => now()->timestamp,
                    'exp' => now()->addMinutes(15)->timestamp,
                ];

                $payload = JWTAuth::factory()->customClaims($customPayload)->make();
                $token = JWTAuth::encode($payload)->get();
                $refreshToken = $this->generateRefreshToken($user);

                return $this->respondWithToken($token, $refreshToken);
            } else {
                Log::error('Ошибка при получении данных о пользователе:', [
                    'status' => $userResponse->status(),
                    'body' => $userResponse->body(),
                ]);
                return response()->json(['error' => 'Failed to obtain user data'], 400);
            }
        } else {
            return response()->json(['error' => 'Не удалось получить токены'], 400);
        }
    }

    /**
     * Формирует ответ с токеном доступа и (опционально) токеном обновления.
     *
     * @param string $token Токен доступа, выданный пользователю.
     * @param string|null $refreshToken (опционально) Токен обновления, который может использоваться для получения нового токена доступа.
     */
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

    /**
     * Генерирует токен обновления для пользователя.
     *
     * @param \App\Models\User $user Пользователь, для которого генерируется токен обновления.
     * @param int $ttl (опционально) Время жизни токена в секундах (по умолчанию 7 дней).
     *
     * @return string Сгенерированный токен обновления.
     */
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

    // TODO: Может вынести позже в класс или трейт отдельный, т.к. такой же метод в AuthController
    private function getRandomNickname(): string
    {
        // Список  прилагательных
        $adjectives1 = [
            'счастливый',
            'быстрый',
            'яркий',
            'крутой',
            'тихий',
            'сладкий',
            'злой',
            'элегантный',
            'удачливый',
            'сказочный',
            'умный',
            'смелый',
            'доброжелательный',
            'сильный',
            'веселый',
            'любопытный',
            'острый',
            'спокойный',
            'дружелюбный',
            'мудрый'
        ];
        $adjectives2 = [
            'happy',
            'fast',
            'bright',
            'cool',
            'silent',
            'sweet',
            'angry',
            'fancy',
            'lucky',
            'candy',
            'clever',
            'brave',
            'kind',
            'strong',
            'funny',
            'curious',
            'sharp',
            'calm',
            'friendly',
            'wise',
        ];

        // Список  существительных
        $nouns1 = [
            'кот',
            'собака',
            'птица',
            'медведь',
            'рыба',
            'волк',
            'лиса',
            'тигр',
            'лев',
            'кролик',
            'мышь',
            'слон',
            'жираф',
            'обезьяна',
            'пингвин',
            'олень',
            'лошадь',
            'корова',
            'сова',
            'акула'
        ];
        $nouns2 = [
            'cat',
            'dog',
            'bird',
            'bear',
            'fish',
            'wolf',
            'fox',
            'tiger',
            'lion',
            'rabbit',
            'mouse',
            'elephant',
            'giraffe',
            'monkey',
            'penguin',
            'deer',
            'horse',
            'cow',
            'owl',
            'shark',
        ];


        do {
            // Генерируем случайное число
            $number = random_int(1000, 9999);

            // Определяем, какой язык использовать (1 или 2)
            $locale = random_int(1, 2);

            // Выбираем случайные прилагательные и существительные в зависимости от языка
            $adjectiveList = ${"adjectives{$locale}"};
            $nounList = ${"nouns{$locale}"};

            $adjective = $adjectiveList[random_int(0, count($adjectiveList) - 1)];
            $noun = $nounList[random_int(0, count($nounList) - 1)];

            // Собираем никнейм
            $nickname = "{$adjective}_{$noun}_{$number}";

            // Проверяем, существует ли уже такой никнейм
            $nicknameExists = UserMetadata::where('nickname', $nickname)->exists();

        } while ($nicknameExists); // Генерируем новый никнейм, если текущий занят

        return $nickname;
    }
}