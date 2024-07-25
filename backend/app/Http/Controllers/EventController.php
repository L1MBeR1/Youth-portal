<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
use App\Models\Project;
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

class EventController extends Controller
{
    /**
     * Список (новый)
     * 
     * Получение списка событий (новый. использовать этот метод)
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
    {//TODO: Переделать
        if (!Auth::user()->can('view', Event::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $eventId = $request->query('eventId');
        $withAuthors = $request->query('withAuthors', false);
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

        $updDate = $request->query('updDate');
        $crtDate = $request->query('crtDate');

        $operator = $request->query('operator', 'and');

        $query = Event::query();

        if ($withAuthors) {
            $query->join('user_metadata', 'events.author_id', '=', 'user_metadata.user_id')
                ->select('events.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
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
        } elseif ($eventId) {
            $query->where('id', $eventId);
            $event = $query->first(); 
            if ($event) {
                $event->increment('views'); 
            }
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

        if ($tagFilter) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }

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

        $events = $query->paginate($perPage);

        $paginationData = [
            'current_page' => $events->currentPage(),
            'from' => $events->firstItem(),
            'last_page' => $events->lastPage(),
            'per_page' => $events->perPage(),
            'to' => $events->lastItem(),
            'total' => $events->total(),
        ];

        return $this->successResponse($events->items(), $paginationData, 200);
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
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event)
    {
        //
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
            return $this->errorResponse('Нет прав на обновление мероприятия', [], 403);
        }

        $event->update($request->validated());

        return $this->successResponse(['events' => $event], 'Мероприятие успешно обновлено', 200); 
    }

/**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse

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
            return $this->errorResponse('Нет прав на удаление мероприятия', [], 403);
        }

        $event->delete();

        return $this->successResponse(['events' => $event], 'Мероприятие успешно удалено', 200);
    }
}
