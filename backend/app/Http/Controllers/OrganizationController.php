<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class OrganizationController extends Controller
{
    /**
     * Создать
     * 
     * Создание новой организации
     * 
     * @group Организации
     * 
     * @authenticated
     * 
     */
    public function store(Request $request)
    {
        if (!Auth::user()->can('create')) {
            return $this->errorResponse('Нет прав', [], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $input = $request->all();

        $organization = new Organization($input);

        $organization->save();

        return $this->successResponse($organization, 'Организация создана', 201);
    }


/**
     * Список
     * 
     * Получение списка организаций
     * 
     * @group Организации
     * 
     * @authenticated
     * 
     * @bodyParam organizationId int ID организации.
     * @urlParam page int Номер страницы.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
     * @urlParam ---tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtDate string Дата создания (формат: Y-m-d).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updDate string Дата обновления (формат: Y-m-d).
     * @urlParam operator string Логический оператор для условий поиска ('and' или 'or').
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getOrganizations(Request $request)
    {//TODO: Переделать
        if (!Auth::user()->can('view', Organization::class)) {
            return $this->errorResponse('Нет прав на просмотр.', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        // $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $organizationId = $request->query('organizationId');
        // $withAuthors = $request->query('withAuthors', false);

        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        // $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');

        $updDate = $request->query('updDate');
        $crtDate = $request->query('crtDate');
        
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

        $operator = $request->query('operator', 'and');

        $query = Organization::query();

        // if ($withAuthors) {
        //     $query->join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
        //         ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
        // }

        // if ($userId) {
        //     $user = User::find($userId);
        //     if (!$user) {
        //         return $this->errorResponse('User not found', [], 404);
        //     }
        //     $query->where('author_id', $userId);
        // } elseif ($currentUser) {
        //     $currentUser = Auth::user();
        //     if ($currentUser) {
        //         $query->where('author_id', $currentUser->id);
        //     } else {
        //         return $this->errorResponse('Current user not found', [], 404);
        //     }
        // } elseif ($blogId) {
        //     $query->where('id', $blogId);
        // }

        if ($organizationId) {
            $query->where('id', $organizationId);
        }


        if (!empty($searchFields) && !empty($searchValues)) {
            if ($operator === 'or') {
                $query->where(function ($query) use ($searchFields, $searchValues) {
                    foreach ($searchFields as $index => $field) {
                        $value = $searchValues[$index] ?? null;
                        if ($value) {
                            $query->orWhere($field, 'LIKE', '%' . $value . '%');
                        }
                    }
                });
            } else {
                foreach ($searchFields as $index => $field) {
                    $value = $searchValues[$index] ?? null;
                    if ($value) {
                        $query->where($field, 'LIKE', '%' . $value . '%');
                    }
                }
            }
        }

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        // if ($tagFilter) {
        //     $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        // }

        $crtFrom = $this->parseDate($crtFrom);
        $crtTo = $this->parseDate($crtTo);
        $updFrom = $this->parseDate($updFrom);
        $updTo = $this->parseDate($updTo);

        if ($crtFrom && $crtTo) {
            $query->whereBetween('created_at', [$crtFrom, $crtTo]);
        } elseif ($crtFrom) {
            $query->where('created_at', '>=', $crtFrom);
        } elseif ($crtTo) {
            $query->where('created_at', '<=', $crtTo);
        }

        if ($updFrom && $updTo) {
            $query->whereBetween('updated_at', [$updFrom, $updTo]);
        } elseif ($updFrom) {
            $query->where('updated_at', '>=', $updFrom);
        } elseif ($updTo) {
            $query->where('updated_at', '<=', $updTo);
        }

        if ($crtDate) {
            $query->whereDate('created_at', '=', $crtDate);
        }
    
        if ($updDate) {
            $query->whereDate('updated_at', '=', $updDate);
        }

        $organizations = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $organizations->currentPage(),
            'from' => $organizations->firstItem(),
            'last_page' => $organizations->lastPage(),
            'per_page' => $organizations->perPage(),
            'to' => $organizations->lastItem(),
            'total' => $organizations->total(),
        ];

        return $this->successResponse($organizations->items(), $paginationData, 200);
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
     * Обновить
     * 
     * @authenticated
     * 
     * @group Организации
     * 
     * @bodyParam name string Название.
     * 
     */
    public function update(Request $request, $id)
    {
        $organization = Organization::find($id);



        if (!$organization) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update')) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $this->validateRequest($request, [
            'name' => 'nullable|string|max:255',
        ]);

        $updateData = $request->only([
            'title',
        ]);

        $organization->update($updateData);

        return $this->successResponse($organization, 'Запись успешно обновлена', Response::HTTP_OK);
    }




    /**
     * Удалить
     * 
     * @group Организации
     * @authenticated
     * 
     */
    public function destroy($id)
    {
        $organization = Organization::find($id);

        if (!$organization) {
            return $this->errorResponse('Блог не найден', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('delete', $organization)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $organization->delete();

        return $this->successResponse(null, 'Запись удалена', Response::HTTP_OK);
    }
}
