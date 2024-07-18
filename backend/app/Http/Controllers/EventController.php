<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
// use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use Illuminate\Support\Facades\Auth;

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
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $tagFilter = $request->query('tagFilter');
        $crtFrom = $request->query('crtFrom');
        $crtTo = $request->query('crtTo');
        $updFrom = $request->query('updFrom');
        $updTo = $request->query('updTo');

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
     * Создать 
     * 
     * Создание нового события
     * 
     * @group События
     * 
     * @authenticated
     */
    public function store(StoreEventRequest $request)
    {
        //
    }





    /**
     * Обновить
     * 
     * Обновление существующего события
     * 
     * @group События
     * 
     * @authenticated
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        //
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
    public function destroy(Event $event)
    {
        //
    }
}
