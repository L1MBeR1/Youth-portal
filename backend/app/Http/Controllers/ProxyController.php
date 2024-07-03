<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ProxyController extends Controller
{
    public function proxyToVk(Request $request)
    {
        $query = http_build_query([
            'client_id' => env('VKONTAKTE_CLIENT_ID'),
            'redirect_uri' => env('VKONTAKTE_REDIRECT_URI'),
            'response_type' => 'code',
            'scope' => 'email',
            'state' => $request->input('state', null),
            // Добавьте другие необходимые параметры
        ]);

        return response()->json(['redirect' => 'https://oauth.vk.com/authorize?' . $query]);
    }
}
