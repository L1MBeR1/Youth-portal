<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Exception;
use Illuminate\Support\Facades\Validator;

class NewsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $news = News::join('user_metadata', 'news.author_id', '=', 'user_metadata.user_id')
            ->select('news.*', 'user_metadata.first_name', 'user_metadata.last_name', 'user_metadata.patronymic', 'user_metadata.nickname')
            ->get();
        return response()->json($news);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNewsRequest $request)
    {
        try{
            if (!Auth::user()->can('create', News::class)) {
                throw new AccessDeniedHttpException('You do not have permission to create a news');
            }

            $this->validateRequest($request, $request->rules());

            // Создание новой новости с использованием проверенных данных
            $news = News::create(array_merge($request->validated(), [
                'status' => 'moderating',
                'author_id' => Auth::id(),
            ]));
            
            return $this->successResponse(['news' => $news], 'News created successfully', 200);
        }   catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(News $news)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNewsRequest $request, $id)
    {
        try{

            $news = News::find($id);

            if (!$news) {
                throw new NotFoundHttpException('News not found');
            }

            if(!Auth::user()->can('update', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to update this news');
            }

            $this->validateRequest($request, $request->rules());
            $validatedData = $request->validated();
            $news->update($validatedData);

            return $this->successResponse(['news' => $news], 'Podcast updated successfully', 200);
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
            $news = News::find($id);

            if (!$news) {
                throw new NotFoundHttpException('News not found');
            }

            // Проверка прав пользователя
            if (!Auth::user()->can('delete', $news)) {
                throw new AccessDeniedHttpException('You do not have permission to delete this news');
            }

            $news->delete();

            return $this->successResponse(['news' => $news], 'News deleted successfully', 200);
        }catch (Exception $e) {
            // Обработка исключений через централизованную функцию
            return $this->handleException($e);
        }
    }


}

