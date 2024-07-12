<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Http\Requests\StorePodcastRequest;
use App\Http\Requests\UpdatePodcastRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class PodcastController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $podkasts = Podcast::join('user_metadata', 'podcasts.author_id', '=', 'user_metadata.user_id')
                ->select('podcasts.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
                ->get();
        return response()->json($podkasts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePodcastRequest $request)
    {
        // Проверка прав пользователя
        if (!Auth::user()->can('create', Podcast::class)) {
            return response()->json(['message' => 'You do not have permission to create a podcast'], 403);
        }

        // Создание нового подкаста с использованием проверенных данных
        $podcast = Podcast::create(array_merge($request->validated(), [
            'status' => 'moderating',
            'author_id' => Auth::id(),
        ]));

        return response()->json(['message' => 'Podcast successfully created', 'podcast' => $podcast], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Podcast $podcast)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Podcast $podcast)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePodcastRequest $request, $id)
    {
        $podcast = Podcast::find($id);
        if(!Auth::user()->can('update', $podcast)) {
            Log::info('User ' . Auth::id() . ' does not have permission to update podcast ' . $podcast->id);
            return response()->json(['message' => 'You do not have permission to update this podcast'], 403);
        }

        $validatedData = $request->validated();
        $podcast->update($validatedData);

        return response()->json(['message' => 'Podcast updated successfully', 'podcast' => $podcast], Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $podcast = Podcast::find($id);

        if (!$podcast) {
            return response()->json(['error' => 'Podcast not found'], Response::HTTP_NOT_FOUND);
        }

        Log::info('Checking permission for user ' . Auth::id());

        // Проверка прав пользователя
        if (!Auth::user()->can('delete', $podcast)) {
            Log::info('User ' . Auth::id() . ' does not have permission to delete podcast ' . $podcast->id);
            return response()->json(['message' => 'You do not have permission to delete this podcast'], 403);
        }

        Log::info('User ' . Auth::id() . ' is deleting podcast ' . $podcast->id);
        $podcast->delete();

        return response()->json(['success' => 'Podcast successfully deleted'], Response::HTTP_OK);
    }
}
