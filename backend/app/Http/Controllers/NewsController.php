<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use App\Http\Requests\StoreNewsRequest;
use App\Http\Requests\UpdateNewsRequest;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Response;

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
    public function store(Request $request)
    {
        // Валидация данных запроса
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'cover_uri' => 'nullable|string',
            'status' => 'nullable|string|max:255',
            'views' => 'nullable|integer',
            'likes' => 'nullable|integer',
            'reposts' => 'nullable|integer',
        ]);

        // Запись данных запроса в переменную $input
        $input = $request->all();

        // Установка значения 'status' в 'moderating'
        $input['status'] = 'moderating';

        // Создание нового блога
        $news = new News($input);
        $news->author_id = Auth::id(); // Установка автора блога как текущего пользователя

        $news->save();

        return response()->json(['message' => 'News successfully created', 'news' => $news], 201);
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
    public function update(Request $request, News $news, $id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['error' => 'News not found'], Response::HTTP_NOT_FOUND);
        }

        $news->title = $request->input('title');
        $news->description = $request->input('description');
        $news->content = $request->input('content');
        $news->cover_uri = $request->input('cover_uri');
        $news->status = $request->input('status');
        // Добавьте другие поля, которые вы хотите обновить

        $news->save();

        return response()->json(['success' => 'News successfully updated'], Response::HTTP_OK);
    }


    /**
     * Remove the specified resource from storage.
     */

    public function destroy($id)
    {
        $news = News::find($id);

        if (!$news) {
            return response()->json(['error' => 'Record not found'], Response::HTTP_NOT_FOUND);
        }

        $news->delete();

        return response()->json(['success' => 'Entry successfully deleted'], Response::HTTP_OK);
    }


}

