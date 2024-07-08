<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as RouteFacade;
// use Illuminate\Http\Request;

class DocsController extends Controller
{
    /**
     * Display a listing of all routes.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $routes = collect(RouteFacade::getRoutes())->map(function (Route $route) {
            return [
                'uri' => $route->uri(),
                'name' => $route->getName(),
                'methods' => $route->methods(),
                'action' => $route->getActionName(),
                'middleware' => $route->gatherMiddleware(),
            ];
        });

        return response()->json($routes);
    }
}
