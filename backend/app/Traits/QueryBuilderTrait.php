<?php
namespace App\Traits;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait QueryBuilderTrait
{
    /**
     * Summary of buildPublicationQuery
     * @param \Illuminate\Http\Request $request
     * @param string $modelClass
     * @param array $requiredFields
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function buildPublicationQuery(Request $request, string $modelClass, array $requiredFields): Builder
    {
        $query = $modelClass::query();
        // $query->paginate($request->get('per_page', 10)); // не работает
        $this->selectFields($query, $requiredFields);
        $this->applyFilters($query, $request);
        $this->applySearch($query, $request);
        return $query;
    }

    private function buildPublicationQueryWithoutRequest(string $modelClass, array $requiredFields): Builder
    {
        $query = $modelClass::query();
        $this->selectFields($query, $requiredFields);
        return $query;
    }


    /**
     * Summary of selectFields
     * @param mixed $query
     * @param mixed $requiredFields
     * @return void
     */
    private function selectFields($query, $requiredFields)
    {
        $selectFields = [];
        $keys = array_keys($requiredFields);

        foreach ($requiredFields as $tableName => $fields) {
            foreach ($fields as $field) {
                if (count($keys) === 1) {
                    $selectFields[] = "{$field}";
                } else {
                    $selectFields[] = "{$tableName}.{$field}";
                }
            }
        }

        if (count($keys) > 1) {
            $query->join($keys[1], "{$keys[0]}.author_id", '=', "{$keys[1]}.user_id");
        }

        $query->select($selectFields);
    }

    /**
     * Summary of selectFields
     * @param mixed $query
     * @param mixed $requiredFields
     */
    private function connectFields($blogId, $requiredFields, $modelClass)
    {
        $selectFields = [];
        $keys = array_keys($requiredFields);

        foreach ($requiredFields as $tableName => $fields) {
            foreach ($fields as $field) {
                $selectFields[] = "{$tableName}.{$field}";
            }
        }

        $query = $modelClass::where("{$keys[0]}.id", $blogId);

        // Проверка наличия нескольких таблиц для join
        if (count($keys) > 1) {
            $query->join($keys[1], "{$keys[0]}.author_id", '=', "{$keys[1]}.user_id");
        }

        // Выборка необходимых полей
        $query->select($selectFields);

        return $query->first();  // Получаем первую (и единственную) запись
    }




    /**
     * Summary of applyFilters
     * @param mixed $query
     * @param \Illuminate\Http\Request $request
     */
    private function applyFilters($query, Request $request)
    {
        $this->applyDateFilters($query, $request);
        $this->applyOtherFilters($query, $request);
    }

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

    private function applyOtherFilters($query, Request $request)
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
    }






    /**
     * Summary of applySearch
     * @param mixed $query
     * @param \Illuminate\Http\Request $request
     * @return void
     */
    private function applySearch($query, Request $request)
    {
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $operator = $request->query('operator', 'and');

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

        if ($tagFilter = $request->query('tagFilter')) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }
    }
}
