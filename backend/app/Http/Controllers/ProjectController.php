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
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait; 
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class ProjectController extends Controller
{
     use QueryBuilderTrait, PaginationTrait;

    /**
     * Поиск
     * 
     * Получение списка проектов (функция для администрации)
     * 
     * @group Проекты
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam projectId int ID проекта.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
     * @urlParam searchColumnName string Поиск по столбцу.
     * @urlParam searchValue string Поисковый запрос.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
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
   // public function getProjects(Request $request)
  //  {//TODO: Переделать
      //  if (!Auth::user()->can('viewAny', Project::class)) {
      //      return $this->errorResponse('Нет прав на просмотр', [], 403);
      //  }

       // $requiredFields = [
       //     'projects' => [
       //         'id', 'name', 'description', 'organization_id'
       //     ],
       // ];

       // $query = Project::query();
       // $this->selectFields($query, $requiredFields);
       // $this->applyFilters($query, $request, false);
       // $this->applySearch($query, $request);
       // $events = $query->paginate($request->get('per_page', 10));
       // $paginationData = $this->makePaginationData($events);
        //return $this->successResponse($events->items(), $paginationData, 200);

        // $perPage = $request->get('per_page', 5);
        // $userId = $request->query('userId');
        // $currentUser = $request->query('currentUser');
        // $projectId = $request->query('projectId');
        // $withAuthors = $request->query('withAuthors', false);
        // $searchColumnName = $request->query('searchColumnName');
        // $searchValue = $request->query('searchValue');
        // $searchFields = $request->query('searchFields', []);
        // $searchValues = $request->query('searchValues', []);
        // $tagFilter = $request->query('tagFilter');
        // $crtFrom = $request->query('crtFrom');
        // $crtTo = $request->query('crtTo');
        // $updFrom = $request->query('updFrom');
        // $updTo = $request->query('updTo');

        // $updDate = $request->query('updDate');
        // $crtDate = $request->query('crtDate');

        // $operator = $request->query('operator', 'and');

        // $query = Project::query();

        // if ($withAuthors) {
        //     $query->join('user_metadata', 'projects.author_id', '=', 'user_metadata.user_id')
        //         ->select('projects.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
        // } elseif ($projectId) {
        //     $query->where('id', $projectId);
        // }

        // if (!empty($searchFields) && !empty($searchValues)) {
        //     if ($operator === 'or') {
        //         $query->where(function ($query) use ($searchFields, $searchValues) {
        //             foreach ($searchFields as $index => $field) {
        //                 $value = $searchValues[$index] ?? null;
        //                 if ($value) {
        //                     $query->orWhere($field, 'LIKE', '%' . $value . '%');
        //                 }
        //             }
        //         });
        //     } else {
        //         foreach ($searchFields as $index => $field) {
        //             $value = $searchValues[$index] ?? null;
        //             if ($value) {
        //                 $query->where($field, 'LIKE', '%' . $value . '%');
        //             }
        //         }
        //     }
        // }

        // if ($searchColumnName) {
        //     $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
        // }

        // if ($tagFilter) {
        //     $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        // }

        // $crtFrom = $this->parseDate($crtFrom);
        // $crtTo = $this->parseDate($crtTo);
        // $updFrom = $this->parseDate($updFrom);
        // $updTo = $this->parseDate($updTo);

        // if ($crtFrom && $crtTo) {
        //     $query->whereBetween('created_at', [$crtFrom, $crtTo]);
        // } elseif ($crtFrom) {
        //     $query->where('created_at', '>=', $crtFrom);
        // } elseif ($crtTo) {
        //     $query->where('created_at', '<=', $crtTo);
        // }

        // if ($updFrom && $updTo) {
        //     $query->whereBetween('updated_at', [$updFrom, $updTo]);
        // } elseif ($updFrom) {
        //     $query->where('updated_at', '>=', $updFrom);
        // } elseif ($updTo) {
        //     $query->where('updated_at', '<=', $updTo);
        // }

        // if ($crtDate) {
        //     $query->whereDate('created_at', '=', $crtDate);
        // }
    
        // if ($updDate) {
        //     $query->whereDate('updated_at', '=', $updDate);
        // }

        // $projects = $query->paginate($perPage);

        // $paginationData = [
        //     'current_page' => $projects->currentPage(),
        //     'from' => $projects->firstItem(),
        //     'last_page' => $projects->lastPage(),
        //     'per_page' => $projects->perPage(),
        //     'to' => $projects->lastItem(),
        //     'total' => $projects->total(),
        // ];

        // return $this->successResponse($projects->items(), $paginationData, 200);
    //}

    /**
     * Parses the date from the given input.
     * Supports both Y-m-d H:i:s and Y-m-d formats.
     * 
     * @param string|null $date
     * @return string|null
     */
    // private function parseDate($date)
    // {
    //     if (!$date) {
    //         return null;
    //     }

    //     if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    //         return $date . ' 00:00:00';
    //     }

    //     return $date;
    // }


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
        if (!Auth::user()->can('create', Project::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $project = Project::create($request->validated() + [
            'author_id' => Auth::id(),
        ]);

        return $this->successResponse(['projects' => $project], 'Project created successfully', 231);
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
        $project = Project::find($id);

        if (!$project) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $project)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $project->update($request->validated());

        return $this->successResponse(['projects' => $project], 'Project updated successfully', 200);
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
        $project = Project::find($id);

        if (!$project) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('delete', $project)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $project->delete();

        return $this->successResponse(['projects' => $project], 'Project deleted successfully', 200); 
    }

    public function getProjectById($id): \Illuminate\Http\JsonResponse
    {
        $project = Project::with('events')->find($id);

        if (!$project) {
            return $this->errorResponse(message: 'Проект не найден', status: Response::HTTP_NOT_FOUND);
        }

        $requiredFields = [
            "id",
            "name",
            "description",
            "created_at",
            "updated_at",
        ];

        $projectData = $project->only($requiredFields);
        $projectData['events'] = $project->events->map(function ($event) {
            return $event->only([
                "id",
                "name",
                "description",
                "address",
                "cover_uri",
                "longitude",
                "latitude",
                "views",
                "start_time",
                "end_time",
                "created_at",
                "updated_at",
            ]);
        });

        return $this->successResponse(data: $projectData);
    }

    public function getProjects(Request $request)
    {
        if (!Auth::user()->can('viewAny', Project::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "projects" => [
                "id",
                "name",
                "description",
                "created_at",
                "updated_at",
            ]
        ];

        $query = $this->buildPublicationQuery($request, Project::class, $requiredFields);
        $projects = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($projects);
        return $this->successResponse($projects->items(), $paginationData, 200);
    }


}
