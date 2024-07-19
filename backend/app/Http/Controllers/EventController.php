<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\User;
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
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }


    /**
     * Список
     * 
     * Получение списка событий
     * 
     * @group События
     * @authenticated
     * 
     * @urlParam userId int ID пользователя.
     * @urlParam currentUser bool Флаг для поиска по текущему пользователю.
     * @urlParam eventId int ID события.
     * @urlParam withAuthors bool Включать авторов в ответ.
     * @urlParam page int Номер страницы.
     * 
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function getEvents(Request $request)
    {
        if (!Auth::user()->can('view', Event::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $perPage = $request->get('per_page', 5);
        $userId = $request->query('userId');
        $currentUser = $request->query('currentUser');
        $eventId = $request->query('eventId');
        $withAuthors = $request->query('withAuthors', false);
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        //TODO: Сделать метод для добавление с проектом и без
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
        try {
            $event = Event::findOrFail($id);

            if (!Auth::user()->can('update', $event)) {
                throw new AccessDeniedHttpException('You do not have permission to update this event');
            }

            $event->update($request->validated());

            return $this->successResponse(['events' => $event], 'Event updated successfully', 200);
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
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(int $id): \Illuminate\Http\JsonResponse
    {
        try{
            $event = Event::findOrFail($id);

            if (!Auth::user()->can('delete', $event)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this event');
            }

            $event->delete();

            return $this->successResponse(['events' => $event], 'Event deleted successfully', 200);
        }catch (ModelNotFoundException $e) {
            return $this->handleException($e);
        }catch (AccessDeniedHttpException $e) {
            return $this->handleException($e);
        }
    }
}
