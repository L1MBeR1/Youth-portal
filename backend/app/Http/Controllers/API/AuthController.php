<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserMetadata;
use Illuminate\Http\Request;
// use Illuminate\Http\Response;
use App\Mail\EmailVerification;
use App\Mail\PasswordUpdate;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
// use Illuminate\Http\RedirectResponse;
// use Illuminate\Support\Facades\Validator;

// use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
// use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
// use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $jwtSecret;

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
        $validator = Validator::make($request->all(), [
            'email' => [
                'nullable',
                'email',
                'unique:user_login_data,email',
                'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/',
            ],
            'phone' => [
                'nullable',
                'string',
                'unique:user_login_data,phone',
                'regex:/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/',
            ],
            'password' => [
                'required',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/',
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
        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'password' => 'required|string',
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
    // public function verifyEmail(Request $request)
    // {
    //     $token = $request->query('token');

    //     if (!$token) {
    //         return $this->errorResponse('Token is missing', [], 400);
    //     }

    //     $user = JWTAuth::setToken($token)->toUser();

    //     if (!$user) {
    //         return $this->errorResponse('Invalid or expired token', [], 400);
    //     }

    //     // проверить тут поле new_email из JWT токена

    //     // Проверка, подтвержден ли email
    //     if ($user->email_verified_at) {
    //         return $this->errorResponse('Email already verified', [], 422);
    //     }

    //     // Подтверждение email
    //     $user->email_verified_at = now();
    //     $user->removeRole('guest');
    //     $user->assignRole('user');
    //     $user->save();

    //     return response()->view('emails.thanks');
    // }
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



            return response()->view('emails.thanks');
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



            return response()->view('emails.thanks');
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
        // Log::info('LOGOUT STARTING...');
        $user = Auth::user();
        // Log::info('DEFINED USER: ' . $user->email);
        // Log::info('SETTING REMEMBER TOKEN TO NULL...');
        $user->remember_token = null;
        // Log::info('REMEMBER TOKEN SET TO NULL');
        $user->save();
        // Log::info('SAVED USER');

        // Log::info('LOGGING OUT...');
        Auth::logout();
        // Log::info('LOGGED OUT');

        // Log::info('RESPONDING...');
        $response = response()->json(['message' => 'Successfully logged out.']);
        $response->withCookie(cookie()->forget('refresh_token'));

        // Log::info('LOGOUT DONE');
        return $response;
    }
    // public function logout()
    // {
    //     $user = Auth::user();

    //     if ($user) {
    //         $user->remember_token = null;
    //         $user->save();
    //     }

    //     Auth::logout();

    //     $response = response()->json(['message' => 'Successfully logged out.']);
    //     $response->withCookie(cookie()->forget('refresh_token'));

    //     return $response;
    // }






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
        // Валидация нового email
        $validator = Validator::make($request->all(), [
            'email' => [
                'required',
                'email',
                'unique:user_login_data,email',
                'regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/',
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
        // Валидация нового email
        $validator = Validator::make($request->all(), [
            'password' => [
                'required',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-])[A-Za-z\d@$!%*?&-]{8,}$/',
            ]
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        $user = Auth::user();
        $password = $request->input('password');

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

        return $this->successResponse(null, 'Password change request sent successfully.');
    }


}
