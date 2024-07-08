<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

// use Illuminate\Http\RedirectResponse;
// use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'nullable|email|unique:user_login_data,email',
            'phone' => 'nullable|string|unique:user_login_data,phone',
            'password' => 'required',
            // 'c_password' => 'required|same:password',
            // 'role' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Validation Error.', 'messages' => $validator->errors()], 422);
        }

        // Проверка, что есть email или телефон
        if (empty($request->email) && empty($request->phone)) {
            return response()->json(['error' => 'Validation Error.', 'messages' => ['email' => 'Either email or phone must be provided.']], 422);
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);

        // $role = $input['role'];
        // unset($input['role']);
        $role = 'user';

        $user = User::create($input);
        $user->assignRole($role);

        UserMetadata::create(['user_id' => $user->id]);

        $success['user'] = $user;

        return response()->json(['success' => $success, 'message' => 'User registered successfully.'], 201);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorised'], 401);
        }

        $user = auth()->user();
        // $user = Auth::user();

        // // Получаем роли пользователя
        // $roles = $user->getRoleNames();

        // // Добавляем пользовательские поля в токен
        // $payload = [
        //     'email' => $user->email,
        //     'roles' => $roles,
        // ];

        // $customToken = JWTAuth::claims($payload)->fromUser($user);

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
            return response()->json(['error' => 'Validation Error.', 'messages' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $metadata = $user->metadata;
        if (!$metadata) {
            $metadata = new UserMetadata();
            $metadata->user_id = $user->id;
        }

        $metadata->fill($request->only([
            'first_name', 'last_name', 'patronymic', 'nickname', 'profile_image_uri', 'city', 'gender', 'birthday'
        ]));

        $metadata->save();

        return response()->json(['message' => 'Profile updated successfully.', 'metadata' => $metadata], 200);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        return response()->json(['user' => Auth::user()], 200);
    }

    /**
     * //TODO: Мб удалить, это в токене есть.
     * 
     */
    public function getRolesAndPermissions()
    {
        $user = Auth::user();
        $roles = $user->getRoleNames();
        $permissions = $user->getPermissionNames();

        return response()->json(['roles' => $roles, 'permissions' => $permissions], 200);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out.'], 200);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }



    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
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
