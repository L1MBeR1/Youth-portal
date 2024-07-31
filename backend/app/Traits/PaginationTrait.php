<?php

namespace App\Traits;

trait PaginationTrait
{
    private function formPagination($q): array
    {
        return [
            'current_page' => $q->currentPage(),
            'last_page' => $q->lastPage(),
            'per_page' => $q->perPage(),
            'total' => $q->total(),
        ];
    }
}
