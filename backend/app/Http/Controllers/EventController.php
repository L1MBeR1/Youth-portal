<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Support\Facades\Auth;

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
        //
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
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
    }
}
