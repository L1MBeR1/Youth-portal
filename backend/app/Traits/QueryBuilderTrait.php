<?php
namespace App\Traits;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

trait QueryBuilderTrait
{
    private function buildPublicationQuery(Request $request, string $modelClass, string $tablename): Builder
    {
        $query = $modelClass::query();
        $this->joinAuthors($query, $tablename);
        $this->applyFilters($query, $request);
        $this->applySearch($query, $request);
        return $query;
    }

    private function joinAuthors($query, $tablename)
    {
        $query->join('user_metadata', "{$tablename}.author_id", '=', 'user_metadata.user_id')
            ->select(
                "{$tablename}.id",
                "{$tablename}.title",
                "{$tablename}.description",
                "{$tablename}.status",
                "{$tablename}.created_at",
                "{$tablename}.updated_at",
                "{$tablename}.likes",
                "{$tablename}.reposts",
                "{$tablename}.views",
                "{$tablename}.cover_uri", 
                'user_metadata.first_name', 
                'user_metadata.last_name', 
                'user_metadata.patronymic', 
                'user_metadata.nickname',
                'user_metadata.profile_image_uri'
            );
    }

    private function applyFilters($query, Request $request)
    {
        if ($userId = $request->query('userId')) {
            $user = User::find($userId);
            if (!$user) {
                return $this->errorResponse('User not found', [], 404);
            }
            $query->where('author_id', $userId);
        } 
        $this->applyDateFilters($query, $request);
        $this->applyStatusFilter($query, $request);
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

    private function applyStatusFilter($query, Request $request)
    {
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
    }

    private function applySearch($query, Request $request)
    {
        $searchColumnName = $request->query('searchColumnName');
        $searchValue = $request->query('searchValue');
        $searchFields = $request->query('searchFields', []);
        $searchValues = $request->query('searchValues', []);
        $operator = $request->query('operator', 'and');

        if ($searchColumnName) {
            $query->where($searchColumnName, 'LIKE', '%' . $searchValue . '%');
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

        if ($tagFilter = $request->query('tagFilter')) {
            $query->whereRaw("description->'meta'->>'tags' LIKE ?", ['%' . $tagFilter . '%']);
        }
    }

}
