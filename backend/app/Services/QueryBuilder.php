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

        foreach ($fields as $table => $fieldsArray) {
            if ($table !== 0) {
                // Преобразуем массив полей в строку, разделяя запятыми
                $fieldsString = explode(',', $fieldsArray);

                // Если таблица объединяется с основной таблицей, добавляем её в запрос
                $this->query->addSelect($table . '.' . $fieldsString);
            }
        }
    }

    public function applyFilters(Request $request): void
    {
        if ($request->has('published')) {
            $this->query->where('published', $request->query('published'));
        }
    }

    public function applySearch(Request $request): void
    {
        if ($request->has('search')) {
            $searchTerm = $request->query('search');
            $this->query->where('title', 'like', "%{$searchTerm}%");
        }
    }

    public function getResult()
    {
        return $this->query->get();
    }
}
