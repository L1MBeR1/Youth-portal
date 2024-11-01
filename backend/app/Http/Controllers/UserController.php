<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Blog;
use App\Models\News;
use App\Models\Podcast;
use App\Mail\AccountDelete;
use App\Models\UserMetadata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;


class UserController extends Controller
{
    public function getUserById($userId)
    {
        $user = User::where('id', $userId)->first();
        $user_metadata = UserMetadata::where('user_id', $userId)->first();
        $permissions = $user->getPermissionsViaRoles()->pluck('name')->toArray();
        $roles = $user->getRoleNames();
        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }


        $res = array_merge($user->toArray(), $user_metadata->toArray(), ['permissions' => $permissions, 'roles' => $roles]);
        return $this->successResponse($res);
    }


    /**
     * Получить список всех пользователей с фильтрацией по роли и дополнительными параметрами
     * 
     * Получение списка всех пользователей с пагинацией, по 10 пользователей на страницу.
     * Фильтрация осуществляется по роли, переданной в параметре `role_name`.
     * Дополнительные фильтры могут быть применены через параметры запроса.
     *
     * @group Пользователи
     * @urlParam role_name string Название роли для фильтрации пользователей.
     * @queryParam searchColumnName string Поиск по столбцу.
     * @queryParam searchValue string Поисковый запрос.
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam bdDate string Дата создания (формат: Y-m-d).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @queryParam page int Номер страницы.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function listUsers(Request $request)
    {
        //TODO: исправить это
        if (!Auth::user()->hasRole('admin|moderator|su')) {
            return $this->errorResponse('Доступ запрещен', [], 403);
        }
        $roleName = $request->query('role_name');
        $query = User::query();

        // Объединение таблиц
        $query->leftJoin('user_metadata', 'user_login_data.id', '=', 'user_metadata.user_id');

        if ($roleName) {
            $query->whereHas('roles', function ($roleQuery) use ($roleName) {
                $roleQuery->where('name', $roleName);
            });
        }

        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        // $searchColumnName = $request->query('searchColumnName');
        // $searchValue = $request->query('searchValue');

        $bdFrom = $request->query('bdFrom');
        $bdTo = $request->query('bdTo');
        $bdDate = $request->query('bdDate');

        $operator = $request->query('operator', 'and');

        if (!empty($searchFields) && !empty($searchValues)) {
            if ($operator === 'or') {
                $query->where(function ($query) use ($searchFields, $searchValues) {
                    foreach ($searchFields as $index => $field) {
                        $value = $searchValues[$index] ?? null;
                        if ($value) {
                            if (in_array($field, ['email', 'phone'])) {
                                $query->orWhere('user_login_data.' . $field, 'iLIKE', '%' . $value . '%');
                            } else {
                                $query->orWhere('user_metadata.' . $field, 'iLIKE', '%' . $value . '%');
                            }
                        }
                    }
                });
            } else {
                foreach ($searchFields as $index => $field) {
                    $value = $searchValues[$index] ?? null;
                    if ($value) {
                        if (in_array($field, ['email', 'phone'])) {
                            $query->where('user_login_data.' . $field, 'iLIKE', '%' . $value . '%');
                        } else {
                            $query->where('user_metadata.' . $field, 'iLIKE', '%' . $value . '%');
                        }
                    }
                }
            }
        }

        // if (!empty($searchFields) && !empty($searchValues)) {
        //     foreach ($searchFields as $index => $field) {
        //         $value = $searchValues[$index] ?? null;
        //         if ($value) {
        //             if (in_array($field, ['email', 'phone'])) {
        //                 $query->where('user_login_data.' . $field, 'iLIKE', '%' . $value . '%');
        //             } else {
        //                 $query->where('user_metadata.' . $field, 'iLIKE', '%' . $value . '%');
        //             }
        //         }
        //     }
        // }

        // if ($searchColumnName && $searchValue) {
        //     if (in_array($searchColumnName, ['email', 'phone'])) {
        //         $query->where('user_login_data.' . $searchColumnName, 'iLIKE', '%' . $searchValue . '%');
        //     } else {
        //         $query->where('user_metadata.' . $searchColumnName, 'iLIKE', '%' . $searchValue . '%');
        //     }
        // }

        $bdFrom = $this->parseDate($bdFrom);
        $bdTo = $this->parseDate($bdTo);

        if ($bdFrom && $bdTo) {
            $query->whereBetween('user_metadata.birthday', [$bdFrom, $bdTo]);
        } elseif ($bdFrom) {
            $query->where('user_metadata.birthday', '>=', $bdFrom);
        } elseif ($bdTo) {
            $query->where('user_metadata.birthday', '<=', $bdTo);
        }

        if ($bdDate) {
            $query->whereDate('user_metadata.birthday', '=', $bdDate);
        }

        // Выполняем запрос с пагинацией
        $users = $query->paginate(10);

        $response = $users->map(function ($user) {
            return [
                'id' => $user->id,
                'email' => $user->email,
                'phone' => $user->phone,
                'first_name' => $user->metadata->first_name,
                'last_name' => $user->metadata->last_name,
                'patronymic' => $user->metadata->patronymic,
                'nickname' => $user->metadata->nickname,
                'profile_image_uri' => $user->metadata->profile_image_uri,
                'city' => $user->metadata->city,
                'gender' => $user->metadata->gender,
                'birthday' => $user->metadata->birthday,
            ];
        });

        $paginationData = [
            'current_page' => $users->currentPage(),
            'from' => $users->firstItem(),
            'last_page' => $users->lastPage(),
            'per_page' => $users->perPage(),
            'to' => $users->lastItem(),
            'total' => $users->total(),
        ];

        return $this->successResponse($response, $paginationData, 200);
    }


    /**
     * Parses the date from the given input.
     * Supports both Y-m-d H:i:s and Y-m-d formats.
     * 
     * @param string|null $date
     * @return string|null
     */
    private function parseDate($date)
    {
        if (!$date) {
            return null;
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date . ' 00:00:00';
        }

        return $date;
    }


    /**
     * Добавить
     * 
     * Добавить роль пользователю
     *
     * @group Пользователи
     * @subgroup Роли
     * @authenticated
     * 
     * @urlParam user_id int ID пользователя.
     * @bodyParam roles array Название роли.
     * @bodyParam email string email пользователя.
     * @bodyParam phone string телефон пользователя (7-1234567890).
     * @bodyParam deleteMode bool optional режим удаления.
     * 
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateUserRoles(StoreUserRequest $request)
    {
        // Log::info($request);
        $request->validated();

        $user = null;

        if ($request->input('user_id')) {
            $user = User::find($request->input('user_id'));
        } elseif ($request->input('email')) {
            $user = User::where('email', $request->input('email'))->first();
        } elseif ($request->input('phone')) {
            $user = User::where('phone', $request->input('phone'))->first();
        }

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $roles = $request->input('roles');

        if ($request->input('deleteMode')) {
            foreach ($roles as $role) {
                $user->removeRole($role);
            }
        } else {
            foreach ($roles as $role) {
                $user->assignRole($role);
            }
        }

        return $this->successResponse([], 'Roles updated successfully');
    }


    /**
     * Удалить
     * 
     * Удалить роль у пользователя с ID `user_id` и названием роли `role_name`.
     * 
     * @group Пользователи
     * @subgroup Роли
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteRoleFromUser($user_id, $role_name)
    {
        $user = User::find($user_id);
        $role = $role_name;

        if (!$user) {
            return $this->errorResponse('User not found', [], 404);
        }

        $user->removeRole($role);

        return $this->successResponse([], 'Роль отнята успешно');
    }

    public function deleteUser(Request $request, $user_id)
    {
        $user = Auth::user();

        if ($user_id == $user->id || $user->can('deleteAny', User::class)) {
            $target_user = User::findOrFail($user_id);
            if (!$target_user) {
                return $this->errorResponse('User not found', [], 404);
            }

            if ($user_id == $user->id) {
                $credentials["password"] = $request->input('password');
                $user = Auth::user();
                $credentials[$user->email ? 'email' : 'phone'] = $user->{$user->email ? 'email' : 'phone'};

                if (!$token = Auth::attempt($credentials)) {
                    return $this->errorResponse('Предоставленные учетные данные неверны', [], 401);
                }
                Mail::to($user->email)->send(new AccountDelete($user, $token));

                return $this->successResponse([], 'Запрошено удаление своего аккаунта');
            }


            // Очистка профиля
            $target_user->metadata->first_name = null;
            $target_user->metadata->last_name = null;
            $target_user->metadata->patronymic = null;
            $target_user->metadata->nickname = null;
            Log::info('Deleting user with ID: ' . $target_user->id);
            // $target_user->metadata->profile_image_uri = null;
            // $target_user->metadata->city = null;
            // $target_user->metadata->gender = null;
            // $target_user->metadata->birthday = null;
            $target_user->metadata->save();

            // Скрытие материалов
            $blogs = Blog::where('author_id', $target_user->id)->get();
            foreach ($blogs as $blog) {
                $blog->status = 'archived';
                $blog->save();
            }
            $news = News::where('author_id', $target_user->id)->get();
            foreach ($news as $new) {
                $new->status = 'archived';
                $new->save();
            }
            $podcasts = Podcast::where('author_id', $target_user->id)->get();
            foreach ($podcasts as $podcast) {
                $podcast->status = 'archived';
                $podcast->save();
            }


            $res = $target_user->delete();
            if ($res) {
                // if ($user_id == $target_user->id) {
                //     // $user->remember_token = null;
                //     // $user->save();
                //     Auth::logout();
                //     $response = response()->json(['message' => 'User deleted successfully.']);
                //     $response->withCookie(cookie()->forget('refresh_token'));
                //     return $response;
                // }
                return $this->successResponse([], 'User deleted successfully.');
            }
            return $this->errorResponse('User not deleted', [], 500);
        } /*else if () {

       }*/ else {
            return $this->errorResponse('Нет прав на удаление', [], 403);
        }
    }

    /**
     * @OA\Get(
     *     path="/api/users",
     *     summary="Получить список пользователей",
     *     @OA\Response(
     *         response=200,
     *         description="Успешный ответ"
     *     )
     * )
     */
    public function deleteAccount(Request $request)
    {
        try {
            $token = $request->query('token');

            if (!$token) {
                return $this->errorResponse('Token is missing', [], 400);
            }


            // $payload = JWTAuth::setToken($token)->getPayload();
            // $newEmail = $payload->get('new_email');
            $user = JWTAuth::setToken($token)->toUser();

            if (!$user) {
                return $this->errorResponse('Invalid or expired token', [], 400);
            }

            // if ($newEmail) {
            //     $user->email = $newEmail;
            //     // $user->email_verified_at = now();
            //     // $user->save();
            // } elseif ($user->email_verified_at) {
            //     return $this->errorResponse('Email already verified', [], 422);
            // }

            $user->delete();

                $user->remember_token = null;
                    // $user->save();
                    Auth::logout();
                //     $response = response()->json(['message' => 'User deleted successfully.']);
                //     $response->withCookie(cookie()->forget('refresh_token'));
                //     return $response;

                $response = response()->json(['message' => 'User deleted successfully.']);
                $response->withCookie(cookie()->forget('refresh_token'));
                return $response;
            // return response()->view('emails.thanks');
        } catch (Exception $e) {
            return $this->errorResponse('Invalid or expired token', [], 400);
        }
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

        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'patronymic' => 'nullable|string|max:255',
            'nickname' => 'nullable|string|max:255',
            'profile_image_uri' => 'nullable|string',
            'city' => 'nullable|string|max:255',
            'gender' => 'nullable|in:m,f',
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

    }

    public function updateNickname(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'nickname' => [
                'required',
                'string',
                'max:255',
                'unique:user_metadata,nickname,' . $user->id . ',user_id'],
        ]);
        

        if ($validator->fails()) {
            return $this->errorResponse('Validation Error', $validator->errors(), 422);
        }

        $metadata = $user->metadata;
        if (!$metadata) {
            $metadata = new UserMetadata();
            $metadata->user_id = $user->id;
        }

        $metadata->nickname = $request->input('nickname');
        $metadata->save();

        return $this->successResponse($metadata, 'Nickname updated successfully.');
    }

    public function checkNickname(Request $request) //проверка доступности никнейма
    {
        $nickname = $request->nickname;
        Log::info('Checking nickname', ['nickname' => $nickname]);
        $existingNickname = UserMetadata::where('nickname', $nickname)->first();

        if ($existingNickname) {
            return response()->json(false);
        }

        return response()->json(true);
    }
}
