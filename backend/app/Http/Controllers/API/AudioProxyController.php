<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AudioProxyController extends Controller
{
    public function getContent(Request $request)
    {
        $filename = $request->input('filename');
        $path = base_path('public/files/' . $filename);

        if (file_exists($path)) {
            $mimeType = mime_content_type($path);
            return response()->file($path, [
                'Content-Type' => $mimeType
            ]);
        } else {
            return response('File not found', 404);
        }
    }
}
