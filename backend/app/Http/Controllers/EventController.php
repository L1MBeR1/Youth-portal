<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Event;
use App\Models\Project;
use App\Traits\EventTrait;
use Illuminate\Http\Request;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;


class EventController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
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
                'id',
                'name',
                'description',
                'address',
                'longitude',
                'latitude',
                'start_time',
                'end_time',
                'views',
                'author_id',
                'project_id'
            ],
            'user_metadata' => [
                //TODO: Определиться с полями
                'nickname',
                'profile_image_uri'
            ],
        ];

        $query = Event::query();
        $this->selectFields($query, $requiredFields);
        $this->applyFilters($query, $request, false);
        $this->applySearch($query, $request);
        $events = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($events);
        return $this->successResponse($events->items(), $paginationData, 200);
    }
    
    
    public function getEventsMap(Request $request)
    {
        $requiredFields = [
            'events' => [
                'id',
                'longitude',
                'latitude',
            ],
        ];

        $query = Event::query();
        $this->selectFields($query, $requiredFields);
        $this->applyFilters($query, $request, false);
        // $this->applySearch($query, $request);
        $events = $query->paginate($request->get('per_page', 100));
        $paginationData = $this->makePaginationData($events);
        return $this->successResponse($events->items(), $paginationData, 200);
    }



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
    {
        Log::info($request);
        $query = Event::with(['project', 'author.metadata']);

        $this->applyEventDateFilters($query, $request);
        $this->applyEventLocationFilters($query, $request);
        $this->applyEventCategoryFilter($query, $request);
        $this->applySearch($query, $request);

        if ($request->input('operator') === 'or') {
            $query->orWhere(function ($q) use ($request) {
                $this->applyEventLocationFilters($q, $request);
                $this->applyEventCategoryFilter($q, $request);
            });
        }

        $result = $query->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($result);

        $formattedResult = $result->map(function ($event) {
            return [
                'id' => $event->id,
                'name' => $event->name,
                'description' => $event->description,
                'address' => $event->address,
                'cover_uri' => $event->cover_uri,
                'longitude' => $event->longitude,
                'latitude' => $event->latitude,
                'views' => $event->views,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'project' => $event->project ? $event->project : [
                    'author' => [
                        'first_name' => $event->author->metadata->first_name,
                        'last_name' => $event->author->metadata->last_name,
                        'nickname' => $event->author->metadata->nickname,
                    ]
                ]
            ];
        });

        return $this->successResponse($formattedResult, $paginationData, 200);
    }

    private function applySearch($query, Request $request): void
    {
        $searchFields = $request->query('searchFields', []);

        foreach ($searchFields as $field) {
            if ($field && in_array($field, ['name', 'description', 'address'])) {
                $searchValues = $request->query('searchValues', []);
                $operator = $request->query('operator', 'and');

                if (!empty($searchFields) && !empty($searchValues)) {
                    $query->where(function ($query) use ($searchFields, $searchValues, $operator) {
                        foreach ($searchFields as $index => $field) {
                            if (!empty($searchValues[$index])) {
                                $query->{$operator === 'or' ? 'orWhere' : 'where'}($field, 'iLIKE', '%' . $searchValues[$index] . '%');
                            }
                        }
                    });
                }

                if ($tagFilter = $request->query('tagFilter')) {
                    $query->whereRaw("description->'meta'->>'tags' iLIKE ?", ['%' . $tagFilter . '%']);
                }
            }
        }
    }



    private function applyEventDateFilters($query, $request)
    {
        if ($request->has('start_date')) {
            $startDate = $request->input('start_date') . ' 00:00:00';
            $query->where('start_time', '>=', $startDate);
        }

        if ($request->has('end_date')) {
            $endDate = $request->input('end_date') . ' 23:59:59';
            $query->where('start_time', '<=', $endDate);
        }
    }

    private function applyEventLocationFilters($query, $request)
    {
        if ($request->has('country') && trim($request->input('country')) !== '') {
            $query->whereRaw("address->>'country' = ?", [$request->input('country')]);
        }

        if ($request->has('city') && trim($request->input('city')) !== '') {
            $query->whereRaw("address->>'city' = ?", [$request->input('city')]);
        }
    }


    private function applyEventCategoryFilter($query, $request)
    {
        if ($request->has('category') && trim($request->input('category')) !== '') {
            $query->where('category', $request->input('category'));
        }
    }


    public function getEventById($id)
    {
        $event = Event::with(['project', 'author.metadata'])->find($id);
        $user = null;

        if (!$event) {
            return $this->errorResponse(message: 'Мероприятие не найдено', status: Response::HTTP_NOT_FOUND);
        }

        $event->increment('views');


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
            'start_time' => $event->start_time,
            'end_time' => $event->end_time,
            // 'likes' => $event->likes,
            // 'reposts' => $event->reposts,
            'longitude' => $event->longitude,
            'latitude' => $event->latitude,
            'views' => $event->views,
            'cover_uri' => $event->cover_uri,
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

    public function getTags()
    {
        // Добавить теги в миграцию, сидер (и фабрику), дописать
    }





    // TODO: Убрать в отдельные контроллеры?
    /**
     * Получить города
     */
    public function getCities(Request $request)
    {
        // TODO: Добавить возможность применения параметров:
        // ?events_available=<bool>
        // если будут какие-то ограничения по доступности мероприятий

        $cities = Event::select(DB::raw("DISTINCT(address->>'city') as city"))
            ->pluck('city');

        return response()->json($cities);
    }


    /**
     * Получить страны
     */
    public function getCountries(Request $request)
    {
        // TODO: Добавить возможность применения параметров:
        // ?events_available=<bool>
        // если будут какие-то ограничения по доступности мероприятий

        $countries = Event::select(DB::raw("DISTINCT(address->>'country') as country"))
            ->pluck('country');

        return response()->json($countries);
    }
}
