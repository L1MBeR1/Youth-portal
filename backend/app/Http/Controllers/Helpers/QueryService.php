<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class BlogService
{
    public function formPagination(LengthAwarePaginator $q)
    {
        return [
            'current_page' => $q->currentPage(),
            'from' => $q->firstItem(),
            'last_page' => $q->lastPage(),
            'per_page' => $q->perPage(),
            'to' => $q->lastItem(),
            'total' => $q->total(),
        ];
    }

    public function parseDate($date)
    {
        if (!$date) {
            return null;
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return $date . ' 00:00:00';
        }

        return $date;
    }

    public function checkSearchPermissions(Request $request)
    {
        if ($request->hasAny(['status', 'searchColumnName', 'searchValue', 'searchFields', 'searchValues'])) {
            if (!Auth::user()->can('search', Blog::class)) {
                return response()->json(['error' => 'Нет прав на просмотр'], 403);
            }
        }
    }

    public function buildBlogQuery(Request $request)
    {
        $query = Blog::query();

        if ($request->query('withAuthors', false)) {
            $this->joinAuthors($query);
        }

        $this->applyFilters($query, $request);
        $this->applySearch($query, $request);

        return $query;
    }

    private function joinAuthors($query)
    {
        $query->join('user_metadata', 'blogs.author_id', '=', 'user_metadata.user_id')
            ->select('blogs.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname');
    }

    private function applyFilters($query, Request $request)
    {
        if ($userId = $request->query('userId')) {
            $user = User::find($userId);
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }
            $query->where('author_id', $userId);
        } elseif ($blogId = $request->query('blogId')) {
            $query->where('id', $blogId);
            $blog = $query->first();
            if ($blog) {
                $blog->increment('views');
            }
        }

        $this->applyDateFilters($query, $request);
        $this->applyStatusFilter($query, $request);
    }

    private function applyDateFilters($query, Request $request)
    {
        $crtFrom = $this->parseDate($request->query('crtFrom'));
        $crtTo = $this->parseDate($request->query('crtTo'));
        $updFrom = $this->parseDate($request->query('updFrom'));
        $updTo = $this->parseDate($request->query('updTo'));

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

        if ($crtDate = $request->query('crtDate')) {
            $query->whereDate('created_at', '=', $crtDate);
        }

        if ($updDate = $request->query('updDate')) {
            $query->whereDate('updated_at', '=', $updDate);
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
