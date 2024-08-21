<?php
namespace App\Traits;

use Illuminate\Http\Request;
use App\Models\Event;

//!!! ПОМЕТКА: если не указан оператор то по дефолту выбирается - AND
trait EventTrait
{
    //TODO Добавить категории мероприятий в отдельном поле в БД
    public function getEventsForUsers(Request $request)
    {
        $query = Event::with(['project', 'author.metadata']);

        $this->applyEventDateFilters($query, $request);
        $this->applyEventLocationFilters($query, $request);
        $this->applyEventCategoryFilter($query, $request);

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
        if ($request->has('country')) {
            $query->whereRaw("address->>'country' = ?", [$request->input('country')]);
        }

        if ($request->has('city')) {
            $query->whereRaw("address->>'city' = ?", [$request->input('city')]);
        }
    }

    private function applyEventCategoryFilter($query, $request)
    {
        if ($request->has('category')) {
            $query->where('category', $request->input('category'));
        }
    }
}