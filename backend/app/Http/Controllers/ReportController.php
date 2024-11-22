<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\News;
use App\Models\User;
use App\Models\Report;
use App\Models\Comment;
use App\Models\Podcast;
use Illuminate\Http\Request;
use Illuminate\Session\Store;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReportRequest;
use App\Http\Requests\UpdateReportRequest;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\PaginationTrait;

class ReportController extends Controller
{
    use PaginationTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (!Auth::user()->can('viewAny', Report::class)) {
            return $this->errorResponse('Нет прав на просмотр', [], 403);
        }

        $grouped = $request->boolean('grouped');

        if ($grouped) {
            return $this->getAllReportsGroupedByResource($request);
        }

        $reports = Report::query();

        if ($request->has('resource_type')) {
            $resourceType = $request->input('resource_type');
            $reports->where('reportable_type', 'iLIKE', "%{$resourceType}%");
        }

        if ($request->has('resource_id')) {
            $resourceId = $request->input('resource_id');
            $reports->where('reportable_id', 'iLIKE', "%{$resourceId}%");
        }

        $reports = $reports->paginate($request->get('per_page', 10));
        $paginationData = $this->makePaginationData($reports);
        $result = $reports->items();

        return $this->successResponse($result, $paginationData, 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReportRequest $request)
    {


        $reportable = null;

        switch ($request->input('resource_type')) {
            case 'blog':
                $reportable = Blog::findOrFail($request->input('resource_id'));
                break;
            case 'podcast':
                $reportable = Podcast::findOrFail($request->input('resource_id'));
                break;
            case 'news':
                $reportable = News::findOrFail($request->input('resource_id'));
                break;
            case 'comment':
                $reportable = Comment::findOrFail($request->input('resource_id'));
                break;
            case 'user':
                $reportable = User::findOrFail($request->input('resource_id'));
                break;
        }

        if (!$reportable) {
            return $this->errorResponse('Нет такой модели', [], Response::HTTP_NOT_FOUND);
        }

        // Создаем жалобу
        $report = new Report([
            'user_id' => auth()->id(),
            'reason' => $request->reason,
            'details' => $request->details
        ]);

        // Привязываем жалобу к нужной модели
        $reportable->reports()->save($report);
        Log::info("dbg-2");

        return $this->successResponse($report, 'Жалоба успешно создана', Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Report $report)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReportRequest $request, $report_id)
    {
        $user = Auth::user();
        $report = Report::findOrFail($report_id);

        // Проверяем права пользователя на редактирование отчета
        if (!$user->can('update', $report)) {
            return $this->errorResponse('Нет прав на редактирование', [], 403);
        }

        // Обновляем поля отчета
        $report->update([
            'reason' => $request->input('reason'),
            'details' => $request->input('details'),
        ]);

        return $this->successResponse($report, 'Жалоба успешно обновлена', Response::HTTP_OK);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($report_id)
    {
        $report = Report::findOrFail($report_id);

        // Проверяем права пользователя на удаление отчета
        if (!Auth::user()->can('delete', $report)) {
            return $this->errorResponse('Нет прав на удаление', [], 403);
        }

        // Удаляем отчет
        $report->delete();

        return $this->successResponse(null, 'Жалоба успешно удалена', Response::HTTP_NO_CONTENT);
    }


    public function getAllReportsGroupedByResource(Request $request)
    {
        $perPage = $request->get('per_page', 10);

        $groupedReports = Report::query()
            ->selectRaw('
            reportable_type,
            reportable_id,
            COUNT(*) as reports_count,
            JSON_AGG(JSON_BUILD_OBJECT(
                \'author_id\', user_id,
                \'reason\', reason,
                \'details\', details
            )) as reports_details
        ')
            ->groupBy('reportable_type', 'reportable_id')
            ->orderByDesc('reports_count')
            ->paginate($perPage);

        $paginationData = $this->makePaginationData($groupedReports);

        foreach ($groupedReports as $key => $value) {
            // Извлекаем имя ресурса
            $resourceType = explode('\\', $value->reportable_type)[2];

            // Загрузка ресурса на основе типа и ID
            $resource = $value->reportable_type::find($value->reportable_id);

            // Проверяем, если ресурс найден
            if ($resource) {
                // Получаем имя ресурса в зависимости от типа
                $resourceName = $this->getResourceName($resourceType, $resource);

                // Добавляем в результат
                $value['reportable_type_label'] = $this->getResourceTypeName($resourceType);
                $value['reportable_type'] = $resourceType;
                $value['reportable_name'] = $resourceName;
            }
        }

        $result = $groupedReports->items();

        return $this->successResponse($result, $paginationData, Response::HTTP_OK);
    }

    protected function getResourceTypeName($type)
    { 
        return match ($type) {
            'Blog' => 'Блог',
            'Podcast' => 'Подкаст',
            'News' => 'Новость',
            'Comment' => 'Комментарий',
            'User' => 'Пользователь',
        };
    }

    /**
     * Получение имени ресурса в зависимости от типа ресурса
     */
    protected function getResourceName($resourceType, $resource)
    {
        switch ($resourceType) {
            case 'Blog':
            case 'Podcast':
            case 'News':
                return $resource->title;
            case 'Comment':
                return $resource->content;
            default:
                return method_exists($resource, 'nickname') ? $resource->nickname() : 'Unknown';
        }
    }


}
