<?php

namespace App\Http\Controllers\API;

use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserMetadata;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
// use Illuminate\Http\RedirectResponse;
// use Illuminate\Support\Facades\Validator;

use Illuminate\Validation\ValidationException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

use PHPOpenSourceSaver\JWTAuth\Validators\Validator;

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
            'email' => 'nullable|email|unique:user_login_data,email',
            'phone' => 'nullable|string|unique:user_login_data,phone',
            'password' => 'required',
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
            'email' => 'nullable|email|unique:user_login_data,email',
            'phone' => 'nullable|string|unique:user_login_data,phone',
            'password' => 'required',
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
    public function verifyEmail(Request $request)
    {
        $token = $request->query('token');

        if (!$token) {
            return $this->errorResponse('Token is missing', [], 400);
        }

        // Попробуйте декодировать токен
        $user = JWTAuth::setToken($token)->toUser();

        if (!$user) {
            return $this->errorResponse('Invalid or expired token', [], 400);
        }

        // Проверка, подтвержден ли email
        if ($user->email_verified_at) {
            return $this->errorResponse('Email already verified', [], 422);
        }

        // Подтверждение email
        $user->email_verified_at = now();
        $user->removeRole('guest');
        $user->assignRole('user');
        $user->save();

        return $this->successResponse('Email verified successfully');
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
        Log::info('\n\n');
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            Log::info('Нет токена');
            return $this->errorResponse('Refresh token is missing', [], 401);
        }

        Log::info('Есть токен =');
        Log::info($refreshToken);

        $decodedToken = base64_decode($refreshToken);
        list($uuid, $expiresAt) = explode('.', $decodedToken);

        if (now()->timestamp > $expiresAt) {
            Log::info('Токен истёк');
            return response()->json([
                'message' => 'Refresh token has expired',
                'data' => [],
                'status_code' => 401
            ])->cookie(cookie()->forget('refresh_token'));
        }

        $user = User::where('remember_token', $refreshToken)->first();
        if (!$user) {
            Log::info('Нет токена у пользователей');
            return response()->json([
                'message' => 'Invalid refresh token',
                'data' => [],
                'status_code' => 401
            ])->cookie(cookie()->forget('refresh_token'));
        }

        if ($user->blocked_at) {
            return response()->json([
                'message' => 'User is blocked',
                'data' => [],
                'status_code' => 403
            ])->cookie(cookie()->forget('refresh_token'));
        }

        Auth::login($user);

        $newToken = Auth::refresh();
        $newRefreshToken = $this->generateRefreshToken($user);

        Log::info('Отдаю токен');
        return $this->respondWithToken($newToken, $newRefreshToken);
    }






    /**
     * Обновление профиля
     * 
     * Обновление профиля пользователя. 
     * Поля, которые не переданы в запросе будут оставлены без изменения.
     * 
     * @group Авторизация
     * @bodyParam first_name string optional first_name
     * @bodyParam last_name string optional last_name
     * @bodyParam patronymic string optional patronymic
     * @bodyParam nickname string optional nickname
     * @bodyParam profile_image_uri string optional profile_image_uri
     * @bodyParam city string optional city
     * @bodyParam gender string optional gender
     * @bodyParam birthday date optional birthday
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    //TODO Изменить принцип валидации на валидацию через request
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'patronymic' => 'nullable|string|max:255',
                'nickname' => 'nullable|string|max:255',
                'profile_image_uri' => 'nullable|string',
                'city' => 'nullable|string|max:255',
                'gender' => 'nullable|in:м,ж',
                'birthday' => 'nullable|date',
            ]);
            
            if ($validator->fails()) {
                return $this->errorResponse('Validation Error', $validator->errors(), 422);
            }

            $user = Auth::user();
            $metadata = $user->metadata;
            if (!$metadata) {
                $metadata = new UserMetadata();
                $metadata->user_id = $user->id;
            }

            $metadata->fill($request->only([
                'first_name',
                'last_name',
                'patronymic',
                'nickname',
                'profile_image_uri',
                'city',
                'gender',
                'birthday'
            ]));

            $metadata->save();

            return $this->successResponse($metadata, 'Profile updated successfully.');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
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
        try {
            $user = Auth::user();
            if (!$user)
                return $this->errorResponse('Неверные данные', [], 400);
            $metadata = $user->metadata;

            return $this->successResponse($metadata, 'Profile retrieved successfully.');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }


    /**
     * Выход из аккаунта
     * 
     * Выход из аккаунта (удаление токенов).
     * 
     * @group Авторизация
     * 
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Log::info('LOGOUT STARTING...');
        $user = Auth::user();
        Log::info('DEFINED USER: ' . $user->email);
        Log::info('SETTING REMEMBER TOKEN TO NULL...');
        $user->remember_token = null;
        Log::info('REMEMBER TOKEN SET TO NULL');
        $user->save();
        Log::info('SAVED USER');

        Log::info('LOGGING OUT...');
        Auth::logout();
        Log::info('LOGGED OUT');

        Log::info('RESPONDING...');
        $response = response()->json(['message' => 'Successfully logged out.']);
        $response->withCookie(cookie()->forget('refresh_token'));

        Log::info('LOGOUT DONE');
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


}
