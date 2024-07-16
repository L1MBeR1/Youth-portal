<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

// use Illuminate\Http\RedirectResponse;
// use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

use Illuminate\Validation\ValidationException;
use Exception;

class AuthController extends Controller
{
    /**
     * Register a User.
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

            return $this->respondWithToken($token);
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }




    /**
     * Логин
     * 
     * Авторизация с помощью [email, phone]
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

        return $this->respondWithToken($token);
    }




    /**
     * Update user profile metadata.
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
     * Get the authenticated User.
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
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            Auth::logout();

            return $this->successResponse([], 'Successfully logged out.');
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        try {
            return $this->respondWithToken(Auth::refresh());
        } catch (Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
        ]);
    }
}
