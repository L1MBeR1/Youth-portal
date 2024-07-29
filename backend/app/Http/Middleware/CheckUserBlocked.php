<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CheckUserBlocked
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        Log::info('MDW');
        // Log::info($user->blocked_at);
        
        if ($user && $user->blocked_at) {
            Log::info('blocked');
            return response()->json(['message' => 'Your account is blocked (middleware)'], 403);
        }

        return $next($request);
    }
}