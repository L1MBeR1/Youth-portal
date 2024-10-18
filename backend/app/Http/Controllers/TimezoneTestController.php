<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Log;
use App\Models\Blog;

class TimezoneTestController extends Controller
{
    // Метод для GET /api/test/timezone/
    public function getTimezones()
    {
        $times = [
            "2000-10-20T00:00:00.000000Z",
            "2000-10-20T05:00:00.000000Z",
            "2000-10-20T10:00:00.000000Z",
            "2000-10-20T15:00:00.000000Z",
            "2000-10-20T20:00:00.000000Z",
            "2000-10-20T23:59:59.000000Z",
        ];

        $times2 = [
            "2000-10-20 08:00:00",
            "2000-10-20 13:00:00",
            "2000-10-20 18:00:00",
            "2000-10-20 23:00:00",
            "2000-10-21 03:00:00",
            "2000-10-21 08:00:00",
        ];

        return response()->json([
            'irkutsk_utc' => $times,
            'irkutsk' => $times2,
            'now_utc' => Carbon::now('UTC')->toIso8601String(),
            'now' => Carbon::now('Asia/Irkutsk')->toIso8601String(),
        ], 200);
    }

    // Метод для POST /api/test/timezone/
    public function checkTimezones(Request $request)
    {
        $input_time = $request->input('time');
        $input_timezone = $request->input('timezone');

        $from = Carbon::parse($input_time, $input_timezone ?? 'UTC')->setTimezone('UTC');
        $to = Carbon::parse($input_time, $input_timezone ?? 'UTC')->addDay()->setTimezone('UTC');

        $blogsByDate = Blog::where('created_at', '>=', $from)
            ->where('created_at', '<=', $to)
            ->select('created_at', 'id')
            ->get();

        $results = [
            'time_from_request' => $input_time,
            'from' => $from,
            'to' => $to,
            'blogs_by_date' => $blogsByDate,
        ];

        return response()->json($results, 200);
    }
}
