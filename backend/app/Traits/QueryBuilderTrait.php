<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;

trait QueryBuilderTrait
{
    /**
     * Применение прочих фильтров
     */
    private function applyOtherFilters($query, Request $request, $onlyPublished): void
    {
        $orderBy = $request->query('orderBy');
        $orderDirection = $request->query('orderDir');
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($orderBy && in_array($orderBy, ['created_at', 'updated_at', 'status', 'title'])) {
            $query->orderBy($orderBy, $orderDirection ?? 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        if ($onlyPublished) {
            $query->where('status', 'published');
        }

        if ($authorId = $request->query('authorId')) {
            $query->where('author_id', $authorId);
        }
    }




    /**
     * Создание запроса для публикаций
     */
    private function buildPublicationQuery(Request $request, string $modelClass, array $requiredFields, $onlyPublished = false, $userId = null): Builder
    {
        $query = $modelClass::query();
        $this->selectFields($query, $requiredFields, $userId, $request->query('timezone'));
        $this->applyFilters($query, $request, $onlyPublished);
        $this->applySearch($query, $request);
        return $query;
    }

    /**
     * Создание запроса для публикаций без использования Request
     */
    private function buildPublicationQueryWithoutRequest(string $modelClass, array $requiredFields): Builder
    {
        $query = $modelClass::query();
        $this->selectFields($query, $requiredFields);
        return $query;
    }


    /**
     * Выборка необходимых полей для запроса
     */
    private function selectFields($query, $requiredFields, $userId = null, $timezone = null): void
    {
        $selectFields = [];
        $keys = array_keys($requiredFields);

        foreach ($requiredFields as $tableName => $fields) {
            foreach ($fields as $field) {
                if ($timezone && in_array($field, ['created_at', 'updated_at'])) {
                    // Преобразуем время из исходной зоны (UTC+8) в UTC, а затем в нужную временную зону
                    $selectFields[] = DB::raw("({$tableName}.{$field} AT TIME ZONE '{$timezone}') as {$field}");
                } else {
                    // Для всех остальных полей
                    $selectFields[] = count($keys) === 1 ? "{$field}" : "{$tableName}.{$field}";
                }
            }
        }

        if (count($keys) > 1) {
            $query->join($keys[1], "{$keys[0]}.author_id", '=', "{$keys[1]}.user_id");
        }

        $query->select($selectFields);

        if ($userId) {
            $type = ucfirst(substr($keys[0], 0, -1));
            $type = "App\Models\\$type";

            $query->leftJoin('likes', function ($join) use ($userId, $type, $keys) {
                $join->on('likes.likeable_id', '=', "{$keys[0]}.id")
                    ->where('likes.likeable_type', '=', $type)
                    ->where('likes.user_id', '=', $userId);
            });

            $query->addSelect(DB::raw('COUNT(likes.id) > 0 as is_liked'));

            $arr = [];
            foreach ($requiredFields[$keys[1]] as $value) {
                $arr[] = $value;
            }
            $query->groupBy("{$keys[0]}.id", $arr);
        }
    }








    /**
     * Подключение полей по ID публикации
     */
    private function connectFields($publicationId, $requiredFields, $modelClass, $userId = null)
    {
        $selectFields = [];
        $keys = array_keys($requiredFields);

        foreach ($requiredFields as $tableName => $fields) {
            foreach ($fields as $field) {
                $selectFields[] = "{$tableName}.{$field}";
            }
        }

        $query = $modelClass::where("{$keys[0]}.id", $publicationId);

        // Проверка наличия нескольких таблиц для join
        if (count($keys) > 1) {
            $query->join($keys[1], "{$keys[0]}.author_id", '=', "{$keys[1]}.user_id");
        }

        $query->select($selectFields);

        if ($userId) {

            $type = substr($keys[0], 0, -1);
            $type = ucfirst($type);
            $type = "App\Models\\$type";


            // Добавляем поле is_liked в выборку
            $query->addSelect(DB::raw(
                "(EXISTS (
                    SELECT 1
                    FROM likes
                    WHERE likes.likeable_id = {$publicationId}
                      AND likes.likeable_type = '{$type}'
                      AND likes.user_id = {$userId}
                )) AS is_liked"
            ));


            // Добавляем поля для группировки
            $arr = [];
            foreach ($requiredFields[$keys[1]] as $value) {
                $arr[] = $value;
            }

            $query->groupBy("{$keys[0]}.id");
            foreach ($arr as $field) {
                $query->groupBy($field);
            }
        }

        return $query->first();
    }




    /**
     * Применение фильтров к запросу
     */
    private function applyFilters($query, Request $request, $onlyPublished)
    {
        $this->applyDateFilters($query, $request);
        $this->applyOtherFilters($query, $request, $onlyPublished);
    }


    /**
     * Применение фильтров по дате
     */
    private function applyDateFilters($query, Request $request)
    {
        $timezone = $request->query('timezone', 'UTC');

        // Функция для проверки наличия времени в строке даты
        function hasTime($dateString)
        {
            return preg_match('/\d{2}:\d{2}:\d{2}/', $dateString) > 0;
        }

        // Обработка crtFrom и crtTo
        if ($startFrom = $request->query('crtFrom')) {
            if (!hasTime($startFrom)) {
                $startFrom .= ' 00:00:00'; // Добавляем время начала дня, если его нет
            }
            $startFrom = Carbon::parse($startFrom, $timezone)->setTimezone('UTC');
            $query->where('created_at', '>=', $startFrom);
        }

        if ($crtTo = $request->query('crtTo')) {
            if (!hasTime($crtTo)) {
                $crtTo .= ' 23:59:59'; // Добавляем время конца дня, если его нет
            }
            $crtTo = Carbon::parse($crtTo, $timezone)->setTimezone('UTC');
            $query->where('created_at', '<=', $crtTo);
        }

        // Обработка updFrom и updTo
        if ($updFrom = $request->query('updFrom')) {
            if (!hasTime($updFrom)) {
                $updFrom .= ' 00:00:00'; // Добавляем время начала дня, если его нет
            }
            $updFrom = Carbon::parse($updFrom, $timezone)->setTimezone('UTC');
            $query->where('updated_at', '>=', $updFrom);
        }

        if ($updTo = $request->query('updTo')) {
            if (!hasTime($updTo)) {
                $updTo .= ' 23:59:59'; // Добавляем время конца дня, если его нет
            }
            $updTo = Carbon::parse($updTo, $timezone)->setTimezone('UTC');
            $query->where('updated_at', '<=', $updTo);
        }

        // Обработка crtDate и updDate (без времени, только дата)
        if ($crtDate = $request->query('crtDate')) {
            $crtDate = Carbon::parse($crtDate, $timezone)->setTimezone('UTC')->startOfDay();
            $query->whereBetween('created_at', [$crtDate, $crtDate->endOfDay()]);
        }

        if ($updDate = $request->query('updDate')) {
            $updDate = Carbon::parse($updDate, $timezone)->setTimezone('UTC')->startOfDay();
            $query->whereBetween('updated_at', [$updDate, $updDate->endOfDay()]);
        }

        if ($startFrom = $request->query('startFrom')) {
            if (!hasTime($startFrom)) {
                $startFrom .= ' 00:00:00'; // Добавляем время начала дня, если его нет
            }
            $startFrom = Carbon::parse($startFrom, $timezone)->setTimezone('UTC');
            $query->where('start_time', '>=', $startFrom);
        }

        if ($startTo = $request->query('startTo')) {
            if (!hasTime($startTo)) {
                $startTo .= ' 23:59:59'; // Добавляем время конца дня, если его нет
            }
            $startTo = Carbon::parse($startTo, $timezone)->setTimezone('UTC');
            $query->where('start_time', '<=', $startTo);
        }

        if ($endFrom = $request->query('endFrom')) {
            if (!hasTime($endFrom)) {
                $endFrom .= ' 00:00:00'; // Добавляем время начала дня, если его нет
            }
            $endFrom = Carbon::parse($endFrom, $timezone)->setTimezone('UTC');
            $query->where('end_time', '>=', $endFrom);
        }

        if ($endTo = $request->query('endTo')) {
            if (!hasTime($endTo)) {
                $endTo .= ' 23:59:59'; // Добавляем время конца дня, если его нет
            }
            $endTo = Carbon::parse($endTo, $timezone)->setTimezone('UTC');
            $query->where('end_time', '<=', $endTo);
        }
    }











    /**
     * Применение поиска к запросу
     */
    private function applySearch($query, Request $request): void
    {
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $operator = $request->query('operator', 'and');

        if (!empty($searchFields) && !empty($searchValues)) {
            $query->where(function ($query) use ($searchFields, $searchValues, $operator) {
                foreach ($searchFields as $index => $field) {
                    if (!empty($searchValues[$index])) {
                        $query->{$operator === 'or' ? 'orWhere' : 'where'}($field, 'LIKE', '%' . $searchValues[$index] . '%');
                    }
                }
            });
        }

        if ($tagFilter = $request->query('tagFilter')) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }
    }
}
