<?php

namespace App\Http\Controllers\API\V1;

use App\Models\Blog;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
// use Spatie\QueryBuilder\QueryBuilder;
use App\Services\QueryBuilder;


class BlogController extends Controller
{
    // public function list(Request $request)
    // {
    //     $blogs = QueryBuilder::for(Blog::class)
    //         ->allowedFields(['id', 'title', 'author_id', 'author.id', 'author.email'])
    //         ->allowedIncludes(['author'])  
    //         ->allowedFilters(['title', 'description', 'author.email'])
    //         ->get();

    //     return $this->successResponse($blogs);
    // }

    public function list(Request $request)
    {
        $blogs = new QueryBuilder(Blog::class, $request);

        $result = $blogs->getResult();



        return $this->successResponse($result);
    }
}
