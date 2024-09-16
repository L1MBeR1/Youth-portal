<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageGenerator
{
    private const MAX_MEDIA_CAPACITY_MB = 500;
    private const MAX_FILE_SIZE_MB = 50;
    private const MAX_FILE_COUNT_PER_DIRECTORY = 100;

    public function generateImageURL(int $id, array $imagesFolders, string $collection, int $imagesCount = 1): array|null
    {
        Log::warning("Function generateImageURL called {$id} {$collection} {$imagesCount}");
        Log::info("current time is " . date('Y-m-d H:i:s'));
        
        $allFiles = [];

        // Собираем файлы из всех папок
        foreach ($imagesFolders as $folder) {
            $files = Storage::disk('local')->files($folder);

            if (!empty($files)) {
                $allFiles = array_merge($allFiles, $files);
            }
        }

        // Если нет файлов в любой из папок, логируем ошибку
        if (empty($allFiles)) {
            Log::error('No files found in any folder');
            return null;
        }

        // Выбираем случайные файлы из всех собранных файлов
        $selectedFiles = $imagesCount > count($allFiles) ?
            array_keys($allFiles) :
            (array) array_rand($allFiles, $imagesCount);

        Log::info('selectedImages');
        Log::info($selectedFiles);

        // Если выбран один файл, array_rand возвращает его без массива, обернем в массив
        if (!is_array($selectedFiles)) {
            $selectedFiles = [$selectedFiles];
        }

        // Формируем массив файлов для отправки
        $attachments = [];
        foreach ($selectedFiles as $index) {
            $filePath = Storage::disk('local')->path($allFiles[$index]);
            $attachments[] = [
                'file' => file_get_contents($filePath),
                'filename' => basename($filePath)
            ];
        }

        // Загружаем файлы напрямую на SFTP (соединение не пересоздается)
        $uploadResponse = $this->upload($attachments, $collection, $id);

        // Если запрос успешен, возвращаем массив путей к загруженным файлам
        if (isset($uploadResponse['filenames'])) {
            $urls = [];
            foreach ($uploadResponse['filenames'] as $file) {
                $urls[] = env('FILES_LINK', '') . $file['filename'];
            }
            return $urls;
        }

        Log::error('Upload failed: ' . json_encode($uploadResponse));
        return null;
    }


    private function upload(array $attachments, $content_type, $content_id)
    {
        $folder = "{$content_type}" . "/{$content_id}";

        if (empty($attachments)) {
            return ['error' => 'No files provided'];
        }

        $uploadedFiles = [];

        foreach ($attachments as $attachment) {
            // Проверка корректности содержимого файла
            if (!$attachment['file']) {
                return ['error' => 'File content is empty'];
            }

            $fileSizeMB = strlen($attachment['file']) / (1024 * 1024);
            if ($fileSizeMB > self::MAX_FILE_SIZE_MB) {
                return ['error' => "One of the files exceeds the maximum allowed size of " . self::MAX_FILE_SIZE_MB . "MB"];
            }

            // Проверка общего размера папки media до загрузки файла
            $totalMediaSizeMB = $this->getDirectorySize('media') / (1024 * 1024);
            $newTotalSizeMB = $totalMediaSizeMB + $fileSizeMB;

            if ($newTotalSizeMB > self::MAX_MEDIA_CAPACITY_MB) {
                return ['error' => 'Media directory capacity exceeded'];
            }

            // Проверка числа файлов в текущей директории
            $filesCount = count(Storage::disk('sftp')->files('media/' . $folder));
            if ($filesCount >= self::MAX_FILE_COUNT_PER_DIRECTORY) {
                return ['error' => 'File limit in the current directory exceeded'];
            }

            // Проверка доступности SFTP
            try {
                if (!Storage::disk('sftp')->exists('/')) {
                    return ['error' => 'SFTP is not available'];
                }
            } catch (Exception $e) {
                Log::error('SFTP connection error: ' . $e->getMessage());
                return ['error' => 'SFTP connection error'];
            }

            // Придумываем MIME типы для проверки (поскольку их нет в этом варианте)
            $allowedMimeTypes = [
                'image/jpeg',
                'image/webp',
                'image/jpg',
                'image/png',
                'image/gif',
                'text/plain',
                'audio/mpeg',
            ];

            // Сохраняем файл на SFTP
            $md5Hash = md5($attachment['file']);
            $extension = pathinfo($attachment['filename'], PATHINFO_EXTENSION);

            // Полный путь для сохранения файла с именем на основе MD5-хэша
            $filePath = 'media/' . $folder . '/' . $md5Hash . '.' . $extension;
            $filename = $folder . '/' . $md5Hash . '.' . $extension;

            // Проверка на существование файла с таким хэшем
            if (Storage::disk('sftp')->exists($filePath)) {
                $uploadedFiles[] = ['filename' => $filename, 'message' => 'File already exists'];
                continue;
            }

            // Сохранение файла на SFTP
            try {
                Storage::disk('sftp')->put($filePath, $attachment['file']);
                $uploadedFiles[] = ['filename' => $filename];
            } catch (Exception $e) {
                Log::error('File upload error: ' . $e->getMessage());
                return ['error' => 'File upload error'];
            }
        }

        // Возвращаем результат
        if (count($uploadedFiles) === 1) {
            return ['filenames' => [$uploadedFiles[0]]];
        }


        // Возвращаем массив файлов
        return ['filenames' => $uploadedFiles];
    }

    private function getDirectorySize($directory): int
    {
        $size = 0;
        $files = Storage::disk('sftp')->allFiles($directory);

        foreach ($files as $file) {
            $size += Storage::disk('sftp')->size($file);
        }

        return $size;
    }
}
