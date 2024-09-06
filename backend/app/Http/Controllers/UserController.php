<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserMetadata;
use Illuminate\Http\Request;
use App\Http\Requests\StoreUserRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

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
                                $query->orWhere('user_login_data.' . $field, 'LIKE', '%' . $value . '%');
                            } else {
                                $query->orWhere('user_metadata.' . $field, 'LIKE', '%' . $value . '%');
                            }
                        }
                    }
                });
            } else {
                foreach ($searchFields as $index => $field) {
                    $value = $searchValues[$index] ?? null;
                    if ($value) {
                        if (in_array($field, ['email', 'phone'])) {
                            $query->where('user_login_data.' . $field, 'LIKE', '%' . $value . '%');
                        } else {
                            $query->where('user_metadata.' . $field, 'LIKE', '%' . $value . '%');
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
        //                 $query->where('user_login_data.' . $field, 'LIKE', '%' . $value . '%');
        //             } else {
        //                 $query->where('user_metadata.' . $field, 'LIKE', '%' . $value . '%');
        //             }
        //         }
        //     }
        // }

        // if ($searchColumnName && $searchValue) {
        //     if (in_array($searchColumnName, ['email', 'phone'])) {
        //         $query->where('user_login_data.' . $searchColumnName, 'LIKE', '%' . $searchValue . '%');
        //     } else {
        //         $query->where('user_metadata.' . $searchColumnName, 'LIKE', '%' . $searchValue . '%');
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
        Log::info($request);
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

    public function deleteUser($user_id)//TODO: soft delete
    {
        $user = Auth::user();

        if ($user_id == $user->id || $user->can('deleteAny', User::class)) {
            $user = User::findOrFail($user_id);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $res = $user->delete();
            if ($res) {
                if ($user_id == $user->id) {
                    // $user->remember_token = null;
                    // $user->save();
                    Auth::logout();
                    $response = response()->json(['message' => 'User deleted successfully.']);
                    $response->withCookie(cookie()->forget('refresh_token'));
                    return $response;
                }
                return $this->successResponse([], 'User deleted successfully.');
            }
            return $this->errorResponse('User not deleted', [], 500);
        } else {
            return $this->errorResponse('Нет прав на удаление', [], 403);
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





}
