<?php

namespace App\Http\Controllers\API;

use App\Mail\ForgotPassword;
use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use App\Mail\PasswordUpdate;
use App\Models\UserMetadata;
// use Illuminate\Http\Response;
use Illuminate\Http\Request;
use App\Mail\RecoverPassword;
use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
// use Illuminate\Http\RedirectResponse;
// use Illuminate\Support\Facades\Validator;

// use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
// use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
// use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenBlacklistedException;
// use PHPOpenSourceSaver\JWTAuth\Exceptions\;

class AuthController extends Controller
{
    protected $jwtSecret;
    // private $passwordRegexp = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*^&-])[A-Za-z\d@$!%#*^&-]{8,}$/";
    private $passwordRegexp = "/^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%#*^&-])[A-Za-z\d@$!%#*^&-]{8,}$/";
    private $emailRegexp = "/^[^\s@]+@[^\s@]+\.[^\s@]+$/";
    private $phoneRegexp = "/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/";

    public function __construct()
    {
        $this->jwtSecret = config('app.JWT_SECRET');
    }


    /**
     * Регистрация
     *
     * Регистрация нового пользователя с использованием [email, phone].
     *
     * @group Авторизация
     * @bodyParam email string required email
     * @bodyParam phone string optional phone
     * @bodyParam password string required password
     *
     * @return \Illuminate\Http\JsonResponse
     */
    //TODO Изменить принцип валидации на валидацию через request
    public function register(Request $request)
    {
        if ($request->email) {
            $request->merge(['email' => strtolower($request->email)]);
        }

        $validator = Validator::make($request->all(), [
            'email' => [
                'nullable',
                'email',
                'unique:user_login_data,email',
                "regex:{$this->emailRegexp}",
            ],
            'phone' => [
                'nullable',
                'string',
                'unique:user_login_data,phone',
                "regex:{$this->phoneRegexp}",
            ],
            'password' => [
                'required',
                "regex:{$this->passwordRegexp}",
            ],
        ]);


        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        if (empty($request->email) && empty($request->phone)) {
            return $this->errorResponse('По крайней мере одно из [email, phone] должны быть предоставлены', [], 422);
        }

        if ($request->email && User::where('email', $request->email)->exists()) {
            return $this->errorResponse('Данный email уже занят', [], 422);
        }

        if ($request->phone && User::where('phone', $request->phone)->exists()) {
            return $this->errorResponse('Данный телефон уже занят', [], 422);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        $input['nickname'] = $this->getRandomNickname();
        $user = User::create($input);
        $user->assignRole('guest');


        UserMetadata::create(['user_id' => $user->id]);

        $credentials = $request->only('password');
        $credentials[$request->email ? 'email' : 'phone'] = $request->{$request->email ? 'email' : 'phone'};

        if (!$token = Auth::attempt($credentials)) {
            return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
        }


        Mail::to($user->email)->send(new EmailVerification($user, $token));
        $refreshToken = $this->generateRefreshToken($user);

        return $this->respondWithToken($token, $refreshToken);

    }




    /**
     * Аутентификация
     *
     * Аутентификация пользователя с помощью [email, phone]
     *
     * @group Авторизация
     * @bodyParam email string required email
     * @bodyParam phone string optional phone
     * @bodyParam password string required password
     *
     */
    //TODO Изменить принцип валидации на валидацию через request
    public function login(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'email' => 'nullable|email',
        //     'phone' => 'nullable|string',
        //     'password' => 'required|string',
        // ]);
        $validator = Validator::make($request->all(), [
            'email' => [
                'nullable',
                'email',
                // 'unique:user_login_data,email',
                "regex:{$this->emailRegexp}",
            ],
            'phone' => [
                'nullable',
                'string',
                // 'unique:user_login_data,phone',
                "regex:{$this->phoneRegexp}",
            ],
            'password' => [
                'required',
                // "regex:{$this->passwordRegexp}",
            ],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        if (empty($request->email) && empty($request->phone)) {
            return $this->errorResponse('По крайней мере одно из [email, phone] должны быть предоставлены', [], 422);
        }

        $credentials = $request->only('password');
        $credentials[$request->email ? 'email' : 'phone'] = $request->{$request->email ? 'email' : 'phone'};

        if (!$token = Auth::attempt($credentials)) {
            return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
        }

        $user = Auth::user();

        if ($user->blocked_at) {
            return $this->errorResponse('Ваш аккаунт заблокирован', [], 403);
        }

        $refreshToken = $this->generateRefreshToken($user);

        return $this->respondWithToken($token, $refreshToken);
    }




    /**
     * Подтверждение почты
     *
     * @group Авторизация
     *
     */
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


    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return $this->errorResponse('Token is missing', [], 400);
        }

        try {
            $payload = JWTAuth::setToken($token)->getPayload();
            $newEmail = $payload->get('new_email');
            $user = JWTAuth::setToken($token)->toUser();

            if (!$user) {
                return $this->errorResponse('Invalid or expired token', [], 400);
            }

            if ($newEmail) {
                $user->email = $newEmail;
                // $user->email_verified_at = now();
                // $user->save();
            } elseif ($user->email_verified_at) {
                return $this->errorResponse('Email already verified', [], 422);
            }

            // Подтверждение email
            $user->email_verified_at = now();
            $user->removeRole('guest');
            $user->assignRole('user');
            $user->save();
            JWTAuth::setToken($token)->invalidate();


            //TODO: x
            // Mail::to($user->email)->send(new EmailVerification($user, $token));
            return $this->successResponse([], 'Email verified successfully');
        } catch (Exception $e) {
            return $this->errorResponse('Invalid or expired token', [], 400);
        }
    }



    public function changePassword(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return $this->errorResponse('Token is missing', [], 400);
        }

        try {
            $payload = JWTAuth::setToken($token)->getPayload();
            $password = $payload->get('password');
            $password = bcrypt($password);
            $user = JWTAuth::setToken($token)->toUser();

            if (!$user) {
                return $this->errorResponse('Invalid or expired token', [], 400);
            }

            if ($password) {
                $user->password = $password;
                // $user->email_verified_at = now();
                // $user->save();
            } elseif ($user->email_verified_at) {
                return $this->errorResponse('Email already verified', [], 422);
            }

            // Подтверждение email
            $user->email_verified_at = now();
            $user->removeRole('guest');
            $user->assignRole('user');
            $user->save();
            JWTAuth::setToken($token)->invalidate();


            //TODO: x
            return $this->successResponse([], 'Email verified successfully');
        } catch (Exception $e) {
            return $this->errorResponse('Invalid or expired token', [], 400);
        }
    }





    /**
     * Генерация uuid v4
     */
    protected function uuidv4()
    {
        $data = random_bytes(16);

        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }




    /**
     * Генерация уникального токена для запоминания пользователя
     */
    protected function generateRefreshToken($user, $ttl = 7 * 24 * 60 * 60)
    {
        $uuid = (string) Str::uuid();
        $expiresAt = now()->addSeconds($ttl)->timestamp;

        $refreshToken = base64_encode($uuid . '.' . $expiresAt);

        $user->remember_token = $refreshToken;
        $user->save();

        return $refreshToken;
    }



    /**
     * Обновление токенов
     *
     * Обновление токенов пользователя с использованием refresh_token.
     * Будет возвращена новая пара токенов access_token и refresh_token.
     *
     * @group Авторизация
     * @bodyParam refresh_token string required refresh_token
     *
     *
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */



    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return $this->errorResponse('Refresh token is missing', [], 401);
        }


        $decodedToken = base64_decode($refreshToken);
        list($uuid, $expiresAt) = explode('.', $decodedToken);

        if (now()->timestamp > $expiresAt) {
            return response()->json([
                'message' => 'Refresh token has expired',
                'data' => [],
                'status_code' => 401
            ])->cookie(cookie()->forget('refresh_token'));
        }

        $user = User::where('remember_token', $refreshToken)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Invalid refresh token',
                'data' => [],
                'status_code' => 401
            ])->cookie(cookie()->forget('refresh_token'));
        }

        Auth::login($user);

        $newToken = Auth::refresh();
        $newRefreshToken = $this->generateRefreshToken($user);

        return $this->respondWithToken($newToken, $newRefreshToken);
    }




    /**
     * Выход из аккаунта
     *
     * Выход из аккаунта (удаление токенов).
     *
     * @group Авторизация
     *
     */
    public function logout()
    {
        $user = Auth::user();
        $user->remember_token = null;
        $user->save();
        Auth::logout();
        $response = response()->json(['message' => 'Successfully logged out.']);
        $response->withCookie(cookie()->forget('refresh_token'));
        return $response;
    }



    /**
     * Получение структуры токена для ответа
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
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
     * Получение профиля
     *
     * Получение информации о пользователе.
     *
     * @group Авторизация
     *
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile()
    {

        $user = Auth::user();
        if (!$user)
            return $this->errorResponse('Неверные данные', [], 400);
        $metadata = $user->metadata;

        return $this->successResponse($metadata, 'Profile retrieved successfully.');

    }


    public function changeEmail(Request $request)
    {
        $credentials["password"] = $request->input('password');
        $user = Auth::user();
        $credentials[$user->email ? 'email' : 'phone'] = $user->{$user->email ? 'email' : 'phone'};

        if (!$token = Auth::attempt($credentials)) {
            return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
        }


        // Валидация нового email
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'email',
                'unique:user_login_data,email',
                'regex:' . $this->emailRegexp,
            ]
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        $user = Auth::user();
        $newEmail = $request->input('email');

        // Создание кастомного payload для токена
        $customPayload = [
            'sub' => $user->id,
            'new_email' => $newEmail,  // Добавляем новый email
            'iat' => now()->timestamp,
            'exp' => now()->addHour()->timestamp,  // Время истечения токена
        ];

        // Создание массива claims (утверждений) для JWT
        $payload = JWTAuth::factory()->customClaims($customPayload)->make();

        // Генерация токена на основе кастомного payload
        $token = JWTAuth::encode($payload)->get();

        // Отправка письма на новый email с токеном для подтверждения
        Mail::to($newEmail)->send(new EmailVerification($user, $token));

        return $this->successResponse(null, 'Email change request sent successfully.');
    }

    public function requestChangePassword(Request $request)
    {
        $credentials["password"] = $request->input('password');
        $user = Auth::user();
        $credentials[$user->email ? 'email' : 'phone'] = $user->{$user->email ? 'email' : 'phone'};

        if (!$token = Auth::attempt($credentials)) {
            return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
        }

        $validator = Validator::make($request->all(), [
            'new_password' => [
                'required',
                'regex:' . $this->passwordRegexp,
            ]
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        $password = $request->input('new_password');

        // Создание кастомного payload для токена
        $customPayload = [
            'sub' => $user->id,
            'password' => $password,  // Добавляем новый email
            'iat' => now()->timestamp,
            'exp' => now()->addHour()->timestamp,  // Время истечения токена
        ];

        // Создание массива claims (утверждений) для JWT
        $payload = JWTAuth::factory()->customClaims($customPayload)->make();

        // Генерация токена на основе кастомного payload
        $token = JWTAuth::encode($payload)->get();

        // Отправка письма на новый email с токеном для подтверждения
        Mail::to($user->email)->send(new PasswordUpdate($user, $token));

        return $this->successResponse([], 'Password change request sent successfully.');
    }

    public function sendPasswordResetLink(Request $request)
    {
        // Валидируем email
        $request->validate([
            'email' => 'required|email'
        ]);

        // Ищем пользователя по email
        $email = $request->input('email');
        $user = User::where('email', $email)->first();

        // Если пользователь не найден
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Формируем payload для токена
        $customPayload = [
            'sub' => $user->id,  // ID пользователя
            'iat' => now()->timestamp,  // Время создания токена
            'email' => $user->email,  // Email пользователя
            'exp' => now()->addMinutes(15)->timestamp,  // Время истечения токена
        ];

        // Создаем токен JWT
        $payload = JWTAuth::factory()->customClaims($customPayload)->make();
        $token = JWTAuth::encode($payload)->get();

        // Формируем URL для сброса пароля (веб-страница)
        $resetUrl = env('APP_URL') . "/reset-password?token=" . $token;

        // Отправляем письмо
        Mail::to($user->email)->send(new ForgotPassword($user, $resetUrl));

        // Возвращаем успешный ответ
        return response()->json(['message' => 'Password reset link sent successfully.'], 200);
    }

    public function recoverPassword(Request $request)
    {
        $email = $request->input('email');
        $user = User::where('email', $email)->first();
        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $customPayload = [
            'sub' => $user->id,
            'iat' => now()->timestamp,
            'email' => $user->email,
            'exp' => now()->addMinutes(15)->timestamp,
        ];

        $payload = JWTAuth::factory()->customClaims($customPayload)->make();
        $token = JWTAuth::encode($payload)->get();

        Mail::to($user->email)->send(new RecoverPassword($user, $token));

        return $this->successResponse([], 'Password change request sent successfully.');

    }

    public function setNewPassword(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return $this->errorResponse('Token is missing', [], 400);
        }

        try {
            // Проверка подлинности токена и извлечение payload
            $payload = JWTAuth::setToken($token)->getPayload();

            // Извлечение данных пользователя из токена
            $userId = $payload->get('sub'); // Идентификатор пользователя

            // Получаем пользователя по userId
            $user = User::find($userId);

            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }



            // Валидация нового пароля
            $validator = Validator::make($request->all(), [
                'password' => [
                    'required',
                    'regex:' . $this->passwordRegexp,
                ]
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Validation Error', $validator->errors(), 422);
            }

            // Установка нового пароля
            $password = bcrypt($request->input('password'));
            $user->password = $password;

            // Дополнительные действия
            $user->email_verified_at = now();
            $user->removeRole('guest');
            $user->assignRole('user');
            $user->save();
            JWTAuth::setToken($token)->invalidate();

            // TODO: x
            return $this->successResponse([], 'Email verified successfully');
        } catch (TokenExpiredException $e) {
            return $this->errorResponse('Token has expired', [], 400);
        } catch (TokenInvalidException $e) {
            return $this->errorResponse('Token is invalid', [], 400);
        } catch (JWTException $e) {
            return $this->errorResponse('Token error', [], 400);
        } catch (Exception $e) {
            return $this->errorResponse('An unexpected error occurred', [], 500);
        }
    }
    public function setNewPasswordRecover(Request $request)
    {
        $token = $request->input('token');

        if (!$token) {
            return $this->errorResponse('Token is missing', [], 400);
        }

        try {
            // Проверка подлинности токена и извлечение payload
            $payload = JWTAuth::setToken($token)->getPayload();

            // Извлечение данных пользователя из токена
            $userId = $payload->get('sub'); // Идентификатор пользователя

            // Получаем пользователя по userId
            $user = User::find($userId);

            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }



            // Валидация нового пароля
            $validator = Validator::make($request->all(), [
                'password' => [
                    'required',

                    'regex:' . $this->passwordRegexp,

                ]
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Validation Error', $validator->errors(), 422);
            }

            // Установка нового пароля
            $password = bcrypt($request->input('password'));
            $user->password = $password;

            // Дополнительные действия
            // $user->email_verified_at = now();
            $user->removeRole('guest');
            $user->assignRole('user');
            $user->save();
            JWTAuth::setToken($token)->invalidate();

            // TODO: x
            return $this->successResponse([], 'Email verified successfully');
        } catch (TokenExpiredException $e) {
            return $this->errorResponse('Token has expired', [], 400);
        } catch (TokenInvalidException $e) {
            return $this->errorResponse('Token is invalid', [], 400);
        } catch (JWTException $e) {
            return $this->errorResponse('Token error', [], 400);
        } catch (Exception $e) {
            return $this->errorResponse('An unexpected error occurred', [], 500);
        }
    }


    // use Illuminate\Http\Request;
    // use OpenSSl\Exceptions\TokenExpiredException;
    // use OpenSSl\Exceptions\TokenInvalidException;
    // use OpenSSl\Exceptions\TokenBlacklistedException;
    // use OpenSSl\Exceptions\JWTException;
    // use OpenSSl\Exceptions\NotBeforeException;
    // use JWTAuth;

    public function validateToken(Request $request)
    {
        // Получение токена из тела запроса
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'error' => 'Token is missing',
            ], 400);
        }

        try {
            // Валидация и получение payload токена
            $payload = JWTAuth::setToken($token)->getPayload();

            // Получение userId из payload
            $userId = $payload->get('sub');

            // Возвращаем успешный ответ
            return response()->json([
                'message' => 'Token is valid',
                'user_id' => $userId,
            ], 200);

        } catch (TokenExpiredException $e) {
            // Токен истек
            return response()->json([
                'error' => 'Token has expired',
            ], 400);

        } catch (TokenInvalidException $e) {
            // Токен недействителен
            return response()->json([
                'error' => 'Token is invalid',
            ], 400);

        // } catch (NotBeforeException $e) {
        //     // Токен ещё не действителен
        //     return response()->json([
        //         'error' => 'Token is not valid yet',
        //     ], 400);

        // 
        } catch (TokenBlacklistedException $e) {
            // Токен уже аннулирован (инвалидирован)
            return response()->json([
                'error' => 'Token is blacklisted',
            ], 400);

        } catch (JWTException $e) {
            // Любая другая ошибка, связанная с JWT
            return response()->json([
                'error' => 'Token error',
            ], 400);

        } catch (Exception $e) {
            // Любая другая неожиданная ошибка
            return response()->json([
                'error' => 'An unexpected error occurred',
            ], 500);
        }
    }


    public function invalidateToken(Request $request)
    {
        // Получение токена из тела запроса
        $token = $request->input('token');

        if (!$token) {
            return response()->json([
                'error' => 'Token is missing',
            ], 400);
        }

        try {
            // Инвалидация токена
            
            JWTAuth::setToken($token)->invalidate();

            return response()->json([
                'message' => 'Token has been invalidated',
            ], 200);

        } catch (TokenBlacklistedException $e) {
            // Если токен уже был инвалидирован
            return response()->json([
                'error' => 'Token is already blacklisted',
            ], 400);

        } catch (JWTException $e) {
            // Любая другая ошибка, связанная с JWT
            return response()->json([
                'error' => 'Token error',
                'e' => $e->getMessage(),
            ], 400);
        } catch (Exception $e) {
            // Любая другая неожиданная ошибка
            return response()->json([
                'error' => 'An unexpected error occurred',
            ], 500);
        }
    }

}
