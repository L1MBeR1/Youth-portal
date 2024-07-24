<?php

namespace App\Http\Controllers\API;

use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Mail;
use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use App\Models\UserMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
// use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;

class AuthController extends Controller
{
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
    public function register(Request $request)
    {
        try {
            $this->validateRequest($request, [
                'email' => 'nullable|email|unique:user_login_data,email',
                'phone' => 'nullable|string|unique:user_login_data,phone',
                'password' => 'required',
            ]);

            if (empty($request->email) && empty($request->phone)) {
                return $this->errorResponse('По крайней мере одно из [email, phone] должны быть предоставлены', [], 422);
            }

            $input = $request->all();
            $input['password'] = bcrypt($input['password']);

            $user = User::create($input);
            $user->assignRole('user');

            UserMetadata::create(['user_id' => $user->id]);

            $credentials = $request->only('password');
            $credentials[$request->email ? 'email' : 'phone'] = $request->{$request->email ? 'email' : 'phone'};

            if (!$token = Auth::attempt($credentials)) {
                return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
            }
            Mail::to($user->email)->send(new EmailVerification($user));
            $refreshToken = $this->generateRefreshToken($user);

            return $this->respondWithToken($token, $refreshToken);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
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
    public function login(Request $request)
    {
        $this->validateRequest($request, [
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'password' => 'required|string',
        ]);

        if (empty($request->email) && empty($request->phone)) {
            return $this->errorResponse('По крайней мере одно из [email, phone] должны быть предоставлены', [], 422);
        }

        $credentials = $request->only('password');
        $credentials[$request->email ? 'email' : 'phone'] = $request->{$request->email ? 'email' : 'phone'};

        if (!$token = Auth::attempt($credentials)) {
            return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
        }

        $user = Auth::user();
        $refreshToken = $this->generateRefreshToken($user);

        return $this->respondWithToken($token, $refreshToken);
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
    // protected function generateRefreshToken($user)
    // {
    //     $refreshToken = $this->uuidv4();
    //     $user->remember_token = $refreshToken;
    //     $user->save();

    //     return $refreshToken;
    // }

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
    // public function refresh(Request $request)
    // {
    //     $request->validate([
    //         'refresh_token' => 'required|string'
    //     ]);

    //     $user = User::where('remember_token', $request->refresh_token)->first();

    //     if (!$user) {
    //         return $this->errorResponse('Invalid refresh token', [], 401);
    //     }

    //     Auth::login($user);

    //     $newToken = Auth::refresh();
    //     $newRefreshToken = $this->generateRefreshToken($user);

    //     return $this->respondWithToken($newToken, $newRefreshToken);
    // }

    // public function refresh(Request $request)
    // {
    //     $request->validate([
    //         'refresh_token' => 'required|string'
    //     ]);

    //     $decodedToken = base64_decode($request->refresh_token);
    //     list($uuid, $expiresAt) = explode('.', $decodedToken);

    //     if (now()->timestamp > $expiresAt) {
    //         return $this->errorResponse('Refresh token has expired', [], 401);
    //     }

    //     $user = User::where('remember_token', $request->refresh_token)->first();
    //     if (!$user) {
    //         return $this->errorResponse('Invalid refresh token', [], 401);
    //     }

    //     Auth::login($user);

    //     $newToken = Auth::refresh();
    //     $newRefreshToken = $this->generateRefreshToken($user);

    //     return $this->respondWithToken($newToken, $newRefreshToken);
    // }
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return $this->errorResponse('Refresh token is missing', [], 401);
        }

        $decodedToken = base64_decode($refreshToken);
        list($uuid, $expiresAt) = explode('.', $decodedToken);

        if (now()->timestamp > $expiresAt) {
            return $this->errorResponse('Refresh token has expired', [], 401);
        }

        $user = User::where('remember_token', $refreshToken)->first();
        if (!$user) {
            return $this->errorResponse('Invalid refresh token', [], 401);
        }

        Auth::login($user);

        $newToken = Auth::refresh();
        $newRefreshToken = $this->generateRefreshToken($user);

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
    public function updateProfile(Request $request)
    {
        try {
            $this->validateRequest($request, [
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'patronymic' => 'nullable|string|max:255',
                'nickname' => 'nullable|string|max:255',
                'profile_image_uri' => 'nullable|string',
                'city' => 'nullable|string|max:255',
                'gender' => 'nullable|in:м,ж',
                'birthday' => 'nullable|date',
            ]);

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
        try {
            $user = Auth::user();
            $user->remember_token = null;
            $user->save();

            Auth::logout();

            return $this->successResponse([], 'Successfully logged out.');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }




    /**
     * Получение структуры токена для ответа
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    // protected function respondWithToken($token, $refreshToken = null)
    // {
    //     return response()->json([
    //         'access_token' => $token,
    //         'refresh_token' => $refreshToken,
    //         'token_type' => 'bearer',
    //     ]);
    // }
    protected function respondWithToken($token, $refreshToken = null)
    {
        $response = response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);

        if ($refreshToken) {
            $response->withCookie(cookie('refresh_token', $refreshToken, 60 * 24 * 7, '/', null, true, true)); // expires in 7 days
        }

        return $response;
    }

}
