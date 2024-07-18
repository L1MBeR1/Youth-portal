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
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json('fdvdfvdf');
    }


    /**
     * Получение списка проектов
     * 
     * Возвращает список проектов с поддержкой пагинации и фильтрации.
     * 
     * @group Проекты
     * @authenticated
     * 
     * @urlParam userId int ID пользователя, чтобы отфильтровать проекты по автору.
     * @urlParam currentUser bool Флаг для поиска проектов текущего пользователя.
     * @urlParam projectId int ID проекта, чтобы получить конкретный проект.
     * @urlParam withAuthors bool Включить авторов в ответ.
     * @urlParam page int Номер страницы для пагинации.
     * @urlParam per_page int Количество элементов на странице.
     * 
     * @response 200 {
     *  "data": [
     *    {
     *      "id": 1,
     *      "name": "Название проекта",
     *      "description": "Описание проекта",
     *      "location": "Местоположение проекта",
     *      "author_id": 1,
     *      "created_at": "2024-01-01T00:00:00.000000Z",
     *      "updated_at": "2024-01-01T00:00:00.000000Z",
     *      "first_name": "Имя автора",
     *      "last_name": "Фамилия автора",
     *      "patronymic": "Отчество автора",
     *      "nickname": "Ник автора"
     *    }
     *  ],
     *  "meta": {
     *    "current_page": 1,
     *    "from": 1,
     *    "last_page": 1,
     *    "per_page": 10,
     *    "to": 1,
     *    "total": 1
     *  }
     * }
     * 
     * @response 403 {
     *  "message": "Нет прав на просмотр"
     * }
     * 
     * @response 404 {
     *  "message": "User not found"
     * }
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        try{
            if (!Auth::user()->can('create', Project::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a project');
            }

            $this->validateRequest($request, $request->rules());

            $project = Project::create(array_merge($request->validated(), [
                'author_id' => Auth::id(),
            ]));
            
            return $this->successResponse(['projects' => $project], 'Project created successfully', 231);
        }   catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
    }

    public function storeTHIS(StoreProjectRequest $request)
    {
        Log::info('checkpoint');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, int $id)
    {
        try {
            $project = Project::findOrFail($id);

            if (!Auth::user()->can('update', $project)) {
                throw new AccessDeniedHttpException('You do not have permission to update this project');
            }

            $project->update($request->validated());

            return $this->successResponse(['projects' => $project], 'Project updated successfully', 200);
        } catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        } catch (ModelNotFoundException $e) {
            Log::info('catch_error', [$e]);
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
        try{
            $project = Project::findOrFail($id);

            if (!Auth::user()->can('delete', $project)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this project');
            }

            $project->delete();

            return $this->successResponse(['projects' => $project], 'Project deleted successfully', 200);
        } catch (AccessDeniedHttpException $e) {
            Log::info('catch_error', [$e]);
            return $this->handleException($e);
        } catch (ModelNotFoundException $e) {
            Log::info('catch_error', [$e]);
            return $this->handleException($e);
        }
    }
}
