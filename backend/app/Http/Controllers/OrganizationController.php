<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use Illuminate\Support\Facades\Validator;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Traits\QueryBuilderTrait;
use App\Traits\PaginationTrait;

class OrganizationController extends Controller
{
    use PaginationTrait, QueryBuilderTrait;
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
    public function store(StoreOrganizationRequest $request)
    {
        if (!Auth::user()->can('create', Organization::class)) {
            return $this->errorResponse('Нет прав', [], 403);
        }

        $organization = Organization::create($request->validated() + [
            'status' => 'moderating',
        ]);

        // Добавляем запись в смежную таблицу
        $organization->users()->attach(Auth::user()->id);

        return $this->successResponse($organization, 'Организация создана и отправлена на модерацию', 201);
    }

    public function updateStatus(int $id, Request $request): \Illuminate\Http\JsonResponse
    {
        $newStatus = $request->input('status');
        $organization = Organization::find($id);

        if (!$organization) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('updateStatus', $organization)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        if (!in_array($newStatus, Organization::STATUSES)) {
            return $this->errorResponse('Invalid status entered', [], 404);
        }

        $organization->update(['status' => $newStatus]);

        return $this->successResponse(['organizations' => $organization], 'Podcast status updated successfully', 200);
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
    public function update(UpdateOrganizationRequest $request, $id)
    {
        $organization = Organization::find($id);

        if (!$organization) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $organization)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $validatedData = $request->validated();

        $organization->update($validatedData);

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

    public function getOrganizationById($id)
    {
        $organization = Organization::find($id);
        Log:info('getOrganizationById');
        if (!$organization) {
            return $this->errorResponse('Организация не найдена', [], Response::HTTP_NOT_FOUND);
        }
    
        $requiredFields = [
            "organizations" => [
                "id",
                "name",
                "created_at",
                "updated_at",
            ]
        ];
    
        $organization = $this->connectFields($organization->id, $requiredFields, Organization::class);
        return $this->successResponse($organization, '', 200);
    }

    public function getOrganizations(Request $request)
    {
        $requiredFields = [
            "organizations" => [
                "id",
                "name",
                "created_at",
                "updated_at",
            ]
        ];

        $query = $this->buildPublicationQuery($request, Organization::class, $requiredFields);
        $organizations = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($organizations);
        return $this->successResponse($organizations->items(), $paginationData, 200);
    }


    


}
