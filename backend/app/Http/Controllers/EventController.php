<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Project;
use App\Traits\EventTrait;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use App\Traits\QueryBuilderTrait;
use App\Traits\PaginationTrait;


class EventController extends Controller
{
    use QueryBuilderTrait, PaginationTrait, EventTrait;
    //TODO: Сделать метод для получения списка событий 
    // с пагинацией с минимальным набором параметров

    
    /**
     * Поиск
     * 
     * Получение списка событий (функция для администрации)
     * 
     * @group События
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @bodyParam eventId int ID события.
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
    public function getEvents(Request $request)
    {
        
        // TODO: Что-то сделать с трейтом


        if (!Auth::user()->can('viewAny', Event::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            'events' => [
                'id', 'name', 'description', 'address', 'longitude', 'latitude', 'start_time', 'end_time', 'views', 'author_id', 'project_id'
            ],
            'user_metadata' => [
                //TODO: Определиться с полями
                'nickname', 'profile_image_uri'
            ],
        ];

        $query = Event::query();
        $this->selectFields($query, $requiredFields);
        $this->applyFilters($query, $request, false);
        $this->applySearch($query, $request);
        $events = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($events);
        return $this->successResponse($events->items(), $paginationData, 200);

        // $perPage = $request->get('per_page', 5);
        // $userId = $request->query('userId');
        // $currentUser = $request->query('currentUser');
        // $eventId = $request->query('eventId');
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

        // $query = Event::query();

        // if ($withAuthors) {
        //     $query->join('user_metadata', 'events.author_id', '=', 'user_metadata.user_id')
        //         ->select('events.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
        // } elseif ($eventId) {
        //     $query->where('id', $eventId);
        //     $event = $query->first(); 
        //     if ($event) {
        //         $event->increment('views'); 
        //     }
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

        // $events = $query->paginate($perPage);

        // $paginationData = [
        //     'current_page' => $events->currentPage(),
        //     'from' => $events->firstItem(),
        //     'last_page' => $events->lastPage(),
        //     'per_page' => $events->perPage(),
        //     'to' => $events->lastItem(),
        //     'total' => $events->total(),
        // ];

        // return $this->successResponse($events->items(), $paginationData, 200);







    }

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
     * Создать
     *
     * Создание нового события
     *
     * @group События
     *
     * @authenticated
     */
    //Добавление мероприятия с привязкой к определенному проекту (если projectId указан в теле запроса) и без привязки к проекту (если projectId не указан)
    public function store(StoreEventRequest $request)
    {
        if (!Auth::user()->can('create', Event::class)) {
            return $this->errorResponse('Нет прав', [], 403);
        }

        $projectId = $request->input('projectId');

        if ($projectId && !Project::find($projectId)) {
            return $this->errorResponse('Проект не найден', [], Response::HTTP_NOT_FOUND);
        }

        $eventData = $request->validated() + [
            'author_id' => Auth::id(),
            'project_id' => $projectId,
        ];

        $event = Event::create($eventData);

        return $this->successResponse(['events' => $event], 'Мероприятие успешно создано', 200);
    }

  

    /**
     * Update the specified resource in storage.
     *
     * @param UpdateEventRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateEventRequest $request, int $id): \Illuminate\Http\JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('update', $event)) {
            return $this->errorResponse('Нет прав на обновление мероприятия', [], Response::HTTP_FORBIDDEN);
        }

        $event->update($request->validated());

        return $this->successResponse(['events' => $event], 'Мероприятие успешно обновлено', Response::HTTP_OK); 
    }


    /**
     * Удалить
     *
     * Удаление существующего события
     *
     * @group События
     *
     * @authenticated
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('delete', $event)) {
            return $this->errorResponse('Нет прав на удаление мероприятия', [], Response::HTTP_FORBIDDEN);
        }

        $event->delete();

        return $this->successResponse(['events' => $event], 'Мероприятие успешно удалено', Response::HTTP_OK);
    }

    /**
     * Получить мероприятия
     *
     * @group Мероприятия (для пользователей)
     *
     * @urlParam start_date string Дата с которой начинается поиск (формат: Y-m-d).
     * @urlParam end_date string Дата до которой ведется поиск (формат: Y-m-d).
     * @urlParam page int Номер страницы.
     * @urlParam perPage int Количество элементов на странице.
     */
    public function getUserEvents(Request $request)
        //TODO убрать определенные поля из response в EventTrait?
    {
        return $this->getEventsForUsers($request);
    }

    public function getEventById($id): \Illuminate\Http\JsonResponse
    {
        $event = Event::with(['project', 'author.metadata'])->find($id);
        $user = null;

        if (!$event) {
            return $this->errorResponse(message: 'Мероприятие не найдено', status: Response::HTTP_NOT_FOUND);
        }

        $event->increment('views');

        $requiredFields = [
            "events" => [
                "id",
                "title",
                "description",
                "status",
                "content",
                "created_at",
                "updated_at",
                "likes",
                "reposts",
                "views",
                "cover_uri",
                "address", // Добавляем поле address
            ],
            "user_metadata" => [
                "first_name",
                "last_name",
                "patronymic",
                "nickname",
                "profile_image_uri",
            ]
        ];

        $user = Auth::user();
        $userId = $user ? $user->id : null;

        // TODO: разобраться с миграциями и остальным. 
        $eventData = [
            'id' => $event->id,
            'title' => $event->name,
            'description' => $event->description,
            // 'status' => $event->status,
            // 'content' => $event->content,
            'created_at' => $event->created_at,
            'updated_at' => $event->updated_at,
            // 'likes' => $event->likes,
            // 'reposts' => $event->reposts,
            'views' => $event->views,
            'cover_uri' => $event->cover_uri ?? 'НЕТ ПОЛЯ В БД',
            'address' => $event->address, // Добавляем поле address
            'project' => $event->project ? $event->project : null,
            'author' => $event->author ? [
                'first_name' => $event->author->metadata->first_name,
                'last_name' => $event->author->metadata->last_name,
                'patronymic' => $event->author->metadata->patronymic,
                'nickname' => $event->author->metadata->nickname,
                'profile_image_uri' => $event->author->metadata->profile_image_uri,
            ] : null
        ];

        return $this->successResponse(data: $eventData);
    }




}
