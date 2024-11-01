<?php
namespace App\Services;

use App\Models\News;
use App\Models\Blog;
use App\Models\Podcast;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\LengthAwarePaginator;

class PopularityCalculator
{
    public function calculatePopularityForType($type)
    {
        Log::info('Начало расчета популярности для типа:', ['type' => $type]);
    
        switch ($type) {
            case 'news':
                $model = News::class;
                $cacheKey = 'popular_news';
                break;
            case 'blogs':
                $model = Blog::class;
                $cacheKey = 'popular_blogs';
                break;
            case 'podcasts':
                $model = Podcast::class;
                $cacheKey = 'popular_podcasts';
                break;
            default:
                Log::error('Неверный тип контента:', ['type' => $type]);
                throw new \InvalidArgumentException('Неверный тип контента');
        }
    
        Log::info('Используемая модель:', ['model' => $model]);
        $items = $model::all();
        Log::info('Количество элементов для расчета популярности:', ['count' => $items->count()]);
    
        $popularityData = [];
    
        foreach ($items as $item) {
            $popularity = $this->calculatePopularity($item);
            $popularityData[$item->id] = [
                'item' => $item, // Полные данные о записи
                'popularity' => $popularity // Рейтинг
            ];
        }
    
        Log::info('Сохранение данных в кэше:', ['key' => $cacheKey, 'data' => $popularityData]);
    
        Cache::put($cacheKey, $popularityData, 60 * 24); //сколько по времени хранится в кэше?
        Log::info('Данные успешно сохранены в кэше для ключа:', ['key' => $cacheKey]);
    }

    private function calculatePopularity($item)
    {
        return ($item->likes * 0.5) + ($item->views * 0.3) + ($item->reposts * 0.2);
    }

    public function getPopularContent($type, $perPage, $currentPage)
    {
        $cacheKey = 'popular_' . $type;
        Log::info('Ключ кэша:', ['key' => $cacheKey]);
        
        // Получаем данные из кэша
        $popularityData = Cache::get($cacheKey);
        
        Log::info('Данные из кэша:', ['data' => $popularityData]);

        if (!$popularityData) {
            Log::warning('Данные не найдены в кэше для ключа:', ['key' => $cacheKey]);
            return null; 
        }

        // Преобразуем кэшированные данные в коллекцию
        $collection = collect($popularityData);

        $sortedCollection = $collection->sortByDesc(function ($data) {
            return $data['popularity'];
        });

        return new LengthAwarePaginator(
            $sortedCollection->forPage($currentPage, $perPage),
            $sortedCollection->count(),
            $perPage,
            $currentPage
        );
    }


    public function getPopularContentByTime($type, $limit)
    {
        $cacheKey = 'popular_' . $type;
        Log::info('Ключ кэша:', ['key' => $cacheKey]);

        $popularityData = Cache::get($cacheKey);

        if (!$popularityData) {
            Log::warning('Данные не найдены в кэше для ключа:', ['key' => $cacheKey]);
            return response()->json(['message' => 'Нет популярных записей'], [], 404);
        }

        $collection = collect($popularityData);
        Log::info($collection);

        $timeFrames = [
            now()->subDay(),
            now()->subWeek(),
            now()->subMonth(),
        ];

        $filteredCollection = $collection->filter(function ($data) use ($timeFrames) {
            if (!isset($data['item']['created_at'])) {
                return false;
            }

            $createdAt = $data['item']['created_at'];

            return collect($timeFrames)->contains(function ($timeFrame) use ($createdAt) {
                return $createdAt >= $timeFrame;
            });
        });

        if ($filteredCollection->isEmpty()) {
            Log::warning('Нет популярных записей за указанные временные рамки.', ['type' => $type]);
            return response()->json(['message' => 'Нет популярных записей'], [], 404);
        }

        $topContent = $filteredCollection->sortByDesc('popularity')->take($limit);

        return response()->json([
            'data' => $topContent->values(),
            'meta' => [],
        ], 200);
    }
}