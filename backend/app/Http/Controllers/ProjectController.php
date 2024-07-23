<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ProjectController extends Controller
{
    /**
     * Список (новый)
     * 
     * Получение списка проектов (новый. использовать этот метод)
     * 
     * @group Проекты
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam projectId int ID проекта.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s).
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getProjects(Request $request)
    {
        if (!Auth::user()->can('view', Project::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $projectId = $request->query('projectId');
        $withAuthors = $request->query('withAuthors', false);
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

        $query = Project::query();

        if ($withAuthors) {
            $query->join('user_metadata', 'projects.author_id', '=', 'user_metadata.user_id')
                ->select('projects.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
        }

        if ($userId) {
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $query->where('author_id', $userId);
        } elseif ($currentUser) {
            $currentUser = Auth::user();
            if ($currentUser) {
                $query->where('author_id', $currentUser->id);
            } else {
                return $this->errorResponse('Current user not found', [], 404);
            }
        } elseif ($projectId) {
            $query->where('id', $projectId);
        }

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        }

        if ($tagFilter) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }

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

        $projects = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $projects->currentPage(),
            'from' => $projects->firstItem(),
            'last_page' => $projects->lastPage(),
            'per_page' => $projects->perPage(),
            'to' => $projects->lastItem(),
            'total' => $projects->total(),
        ];

        return $this->successResponse($projects->items(), $paginationData, 200);
    }




    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreProjectRequest $request The request object containing the project data.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the created project.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException If the user does not have permission to create a project.
     */
    public function store(StoreProjectRequest $request): \Illuminate\Http\JsonResponse
    {
        try {
            if (!Auth::user()->can('create', Project::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a project');
            }

            $this->validateRequest($request, $request->rules());

            $project = Project::create(array_merge($request->validated(), [
                'author_id' => Auth::id(),
            ]));

            return $this->successResponse(['projects' => $project], 'Project created successfully', 231);
        } catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
    }






    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateProjectRequest $request The request object containing the updated project data.
     * @param int $id The ID of the project to update.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the updated project.
     * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException If the user does not have permission to update the project.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the project with the given ID is not found.
     */
    public function update(UpdateProjectRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            if (!Auth::user()->can('update', $project)) {
                throw new AccessDeniedHttpException('You do not have permission to update this project');
            }

            $project->update($request->validated());

            return $this->successResponse(['projects' => $project], 'Project updated successfully', 200);
        } catch (AccessDeniedHttpException | ModelNotFoundException $e) {
            return $this->handleException($e);
        }
    }




    /**
     * Remove the specified resource from storage.
     *
     * @param int $id The ID of the project to delete.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the deleted project.
     * @throws \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException If the user does not have permission to delete the project.
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException If the project with the given ID is not found.
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        try {
            $project = Project::findOrFail($id);

            if (!Auth::user()->can('delete', $project)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this project');
            }

            $project->delete();

            return $this->successResponse(['projects' => $project], 'Project deleted successfully', 200);
        } catch (AccessDeniedHttpException | ModelNotFoundException$e) {
            Log::info('catch_error', [$e]);
            return $this->handleException($e);
        } 
    }
}
