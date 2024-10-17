<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class QueryBuilder
{
    protected Builder $query;

    public function __construct(string $modelClass, Request $request)
    {
        $this->query = $modelClass::query();
        $this->applyRequest($request);
    }




    protected function applyRequest(Request $request): void
    {
        $this->selectFields($request);
        $this->applyFilters($request);
        $this->applySearch($request);
    }



    private function selectFields($request): void
    {
        $fields = $request->input('fields', []);

        // Обрабатываем поля для основной таблицы (если есть)
        if (isset($fields[0])) {
            $this->query->select(explode(',', $fields[0]));
        }

        foreach ($fields as $table => $fieldsString) {
            if ($table !== 0) {
                $fieldsArray = explode(',', $fieldsString);
                $this->query->addSelect($table . '.' . $fieldsArray);
            }
        }
    }

    public function applyFilters(Request $request): void
    {
        /**
         * Применение фильтров
         * field => values
         * table.field => values
         */
        $filters = $request->input('filter', []);

        foreach ($filters as $field => $valuesString) {
            $values = explode(',', $valuesString);
            // dump($values[0]);
            $this->query->where($field, $values[0]);
            // $this->query->where($field, $values);
        }
        // dump($filters);

        // if ($request->has('published')) {
        //     $this->query->where('published', $request->query('published'));
        // }
    }

    public function applySearch(Request $request): void
    {
        $filters = $request->input('search', []);

        foreach ($filters as $field => $valuesString) {
            $values = explode(',', $valuesString);

            foreach ($values as $value) {
                $this->query->where($field,'ilike', "%{$value}%");
            }
        }



        // if ($request->has('search')) {
        //     $searchTerm = $request->query('search');
        //     $this->query->where('title', 'ilike', "%{$searchTerm}%");
        // }
    }

    public function getResult()
    {
        return $this->query->get();
    }
}
