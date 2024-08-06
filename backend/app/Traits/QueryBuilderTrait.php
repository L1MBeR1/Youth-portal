<?php

namespace App\Traits;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait QueryBuilderTrait
{
    /**
     * Создание запроса для публикаций
     * 
     * @param Request $request
     * @param string $modelClass
     * @param array $requiredFields
     * @return Builder
     */
    private function buildPublicationQuery(Request $request, string $modelClass, array $requiredFields, $onlyPublished = false): Builder
    {
        $query = $modelClass::query();
        $this->selectFields($query, $requiredFields);
        $this->applyFilters($query, $request, $onlyPublished);
        $this->applySearch($query, $request);
        return $query;
    }

    /**
     * Создание запроса для публикаций без использования Request
     * @param string $modelClass
     * @param array $requiredFields
     * @return Builder
     */
    private function buildPublicationQueryWithoutRequest(string $modelClass, array $requiredFields): Builder
    {
        $query = $modelClass::query();
        $this->selectFields($query, $requiredFields);
        return $query;
    }


    /**
     * Выборка необходимых полей для запроса
     * 
     * @param mixed $query
     * @param mixed $requiredFields
     * @return void
     */
    private function selectFields($query, $requiredFields): void
    {
        $selectFields = [];
        $keys = array_keys($requiredFields); 

        foreach ($requiredFields as $tableName => $fields) {
            foreach ($fields as $field) {
                $selectFields[] = count($keys) === 1 ? "{$field}" : "{$tableName}.{$field}";
            }
        }

        if (count($keys) > 1) {
            $query->join($keys[1], "{$keys[0]}.author_id", '=', "{$keys[1]}.user_id");
        }

        $query->select($selectFields);
    }

    /**
     * Подключение полей по ID публикации
     * 
     * @param mixed $query
     * @param mixed $requiredFields
     */
    private function connectFields($publicationId, $requiredFields, $modelClass)
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

        return $query->first(); 
    }




    /**
     * Применение фильтров к запросу
     * 
     * @param mixed $query
     * @param Request $request
     */
    private function applyFilters($query, Request $request, $onlyPublished)
    {
        $this->applyDateFilters($query, $request);
        $this->applyOtherFilters($query, $request, $onlyPublished);
    }


    /**
     * Применение фильтров по дате
     * 
     * @param mixed $query
     * @param Request $request
     * @return void
     */
    private function applyDateFilters($query, Request $request)
    {
        if ($crtFrom = $request->query('crtFrom')) {
            $query->whereDate('created_at', '>=', Carbon::parse($crtFrom));
        }

        if ($crtTo = $request->query('crtTo')) {
            $query->whereDate('created_at', '<=', Carbon::parse($crtTo));
        }

        if ($updFrom = $request->query('updFrom')) {
            $query->whereDate('updated_at', '>=', Carbon::parse($updFrom));
        }

        if ($updTo = $request->query('updTo')) {
            $query->whereDate('updated_at', '<=', Carbon::parse($updTo));
        }

        if ($crtDate = $request->query('crtDate')) {
            $query->whereDate('created_at', Carbon::parse($crtDate));
        }

        if ($updDate = $request->query('updDate')) {
            $query->whereDate('updated_at', Carbon::parse($updDate));
        }
    }


    /**
     * Применение прочих фильтров
     * 
     * @param mixed $query
     * @param Request $request
     * @return void
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
    }






    /**
     * Применение поиска к запросу
     * 
     * @param mixed $query
     * @param Request $request
     * @return void
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
