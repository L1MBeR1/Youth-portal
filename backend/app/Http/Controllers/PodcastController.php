<?php

namespace App\Http\Controllers;

use App\Models\Podcast;
use App\Http\Requests\StorePodcastRequest;   
use App\Http\Requests\UpdatePodcastRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Exception;
use Illuminate\Support\Facades\Validator;

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
        try {
            // Проверка прав пользователя
            if (!Auth::user()->can('create', Podcast::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a podcast');
            }

            $this->validateRequest($request, $request->rules());

            // Создание нового подкаста с использованием проверенных данных
            $podcast = Podcast::create(array_merge($request->validated(), [
                'status' => 'moderating',
                'author_id' => Auth::id(),
            ]));
            return $this->successResponse(['podcast' => $podcast], 'Podcast created successfully', 200);
        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
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
        try{

            $podcast = Podcast::find($id);

            if (!$podcast) {
                throw new NotFoundHttpException('Podcast not found');
            }

            if(!Auth::user()->can('update', $podcast)) {
                throw new AccessDeniedHttpException('You do not have permission to update this podcast');
            }

            $this->validateRequest($request, $request->rules());
            $validatedData = $request->validated();
            $podcast->update($validatedData);

            return $this->successResponse(['podcast' => $podcast], 'Podcast updated successfully', 200);
        } catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try{
            $podcast = Podcast::find($id);

            if (!$podcast) {
                throw new NotFoundHttpException('Podcast not found');
            }

            // Проверка прав пользователя
            if (!Auth::user()->can('delete', $podcast)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this podcast');
            }

            $podcast->delete();

            return $this->successResponse(['podcast' => $podcast], 'Podcast deleted successfully', 200);
        }catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }
}
