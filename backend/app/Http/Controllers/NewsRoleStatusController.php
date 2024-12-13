<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\NewsRoleStatus;
use App\Traits\PaginationTrait;
use App\Traits\QueryBuilderTrait;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\SetContentStatusRequest;
use App\Http\Requests\UpdateNewsRequest;
use Symfony\Component\HttpFoundation\Response;




class NewsRoleStatusController extends Controller
{
    use QueryBuilderTrait, PaginationTrait;
    public function store(Request $request)
    {
        if (!Auth::user()->can('create', NewsRoleStatus::class)) {
            return $this->errorResponse('Отсутствуют разрешения', [], 403);
        }

        $news_role_status = NewsRoleStatus::create([
            'status' => 'review',
            'author_id' => Auth::id(),
            'content' => $request->input('content'),
        ]);

        return $this->successResponse(['news_role_status' => $news_role_status], 'Created successfully', 200);
    }

    public function destroy($id)
    {
        $news_role_status = NewsRoleStatus::find($id);

        if (!Auth::user()->can('delete', $news_role_status)) {
            return $this->errorResponse('Нет прав на удаление', [], 403);
        }

        if (!$news_role_status) {
            return $this->errorResponse('Запись не найден', [], 404);
        }

        $res = $news_role_status->delete();
        if ($res) {
            return $this->successResponse([], 'Запись успешно удален');
        }
        return $this->errorResponse('Не удалось удалить запись', [], 500);
    }

    public function setStatus(SetContentStatusRequest $request, $id)
    {
        $news_role_status = NewsRoleStatus::find($id);

        if (!$news_role_status) {
            return $this->errorResponse('Запись не найдена', [], Response::HTTP_NOT_FOUND);
        }

        if (!Auth::user()->can('changeStatus', $news_role_status)) {
            return $this->errorResponse('Отсутствуют разрешения', [], Response::HTTP_FORBIDDEN);
        }

        $request->validated();

        // Изменяем статус
        $newStatus = $request->input('status');
        $news_role_status->status = $newStatus;

        // Проверяем, если статус "approved"
        if ($news_role_status->status === 'approved') {
            // Устанавливаем moder_id
            $news_role_status->moder_id = Auth::id(); // Получаем ID текущего пользователя
        } elseif ($news_role_status->status === 'withdrawn' || $news_role_status->status === 'review') {
            // Находим пользователя по author_id
            $user = User::find($news_role_status->author_id);

            if ($user) {
                // Удаляем роль с role_id = 8 (или нужный вам ID) у пользователя
                $user->roles()->detach(6); // Здесь 8 - это ID роли, которую нужно удалить
            }
        }


        $news_role_status->save(); // Сохраняем изменения

        // Проверяем, если статус "approved" и добавляем запись в model_has_roles
        if ($news_role_status->status === 'approved') {
            // Находим пользователя по author_id
            $user = User::find($news_role_status->author_id);

            if ($user) {
                // Проверяем, есть ли уже роль с role_id = 8
                if (!$user->roles()->where('role_id', 6)->exists()) {
                    // Присваиваем роль пользователю
                    $user->roles()->attach(6); // Здесь 8 - это ID роли, которую нужно добавить
                }
            }
        }



        return $this->successResponse($news_role_status, 'Запись успешно обновлена', Response::HTTP_OK);
    }

    /**
     * Поиск
     * 
     * 
     * @group Блоги
     * @authenticated
     * 
     * @bodyParam userId int ID пользователя.
     * @bodyParam currentUser bool Флаг для поиска по текущему пользователю.
     * @urlParam page int Номер страницы.
     * @urlParam per_page int Элементов на странице.
     * 
     * 
     * @urlParam searchFields string[] Массив столбцов для поиска.
     * @urlParam searchValues string[] Массив значений для поиска.
     * @urlParam tagFilter string Фильтр по тегу в meta описания.
     * @urlParam crtFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam crtDate string Дата создания (формат: Y-m-d).
     * @urlParam updFrom string Дата начала (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updTo string Дата окончания (формат: Y-m-d H:i:s или Y-m-d).
     * @urlParam updDate string Дата обновления (формат: Y-m-d).
     * @urlParam operator string Логический оператор для условий поиска ('and' или 'or').
     * 
     */
    public function getNewsRolesStatusList(Request $request)
    {
        if (!Auth::user()->can('getList', NewsRoleStatus::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $requiredFields = [
            "news_role_status" => [
                "id",
                "status",
                "content",
                "created_at",
                "updated_at",
                "moder_id", // Добавляем moder_id для получения данных о модераторе
            ],
            "user_metadata" => [
                "first_name",
                "last_name",
                "patronymic",
                "nickname",
            ]
        ];

        $query = $this->buildPublicationQuery($request, NewsRoleStatus::class, $requiredFields);
        $news_role_status = $query->paginate($request->get('per_page', 10));

        // Получаем данные о модераторах, если статус 'issued'
        foreach ($news_role_status as $news) {
            if ($news->status === 'approved' || $news->status === 'withdrawn') {
                $moderator = $news->moderator; // Получаем модератора
            }
        }

        $paginationData = $this->makePaginationData($news_role_status);
        return $this->successResponse($news_role_status->items(), $paginationData, 200);
    }



}
