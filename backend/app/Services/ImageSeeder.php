<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageSeeder
{
    private const MAX_MEDIA_CAPACITY_MB = 500;
    private const MAX_FILE_SIZE_MB = 50;
    private const MAX_FILE_COUNT_PER_DIRECTORY = 100;

    public function generateImageURL(int $id, array $foldersWithCounts, string $collection): ?array
    {
        Log::warning("Function generateImageURL called: ID: {$id}, Collection: {$collection}");
        Log::info("Current time: " . now());

        $allSelectedFiles = $this->collectFilesByFolderCounts($foldersWithCounts);

        if (empty($allSelectedFiles)) {
            Log::error('No files found in any folder');
            return null;
        }

        $attachments = $this->prepareAttachments($allSelectedFiles);

        $uploadResponse = $this->upload($attachments, $collection, $id);

        return $this->getUploadUrls($uploadResponse);
    }

    private function collectFilesByFolderCounts(array $foldersWithCounts): array
    {
        $allSelectedFiles = [];

        foreach ($foldersWithCounts as $folder => $filesCount) {
            $files = Storage::disk('local')->files($folder);

            if (!empty($files)) {
                // Берем только указанное количество файлов из папки
                $selectedFiles = $this->selectRandomFiles($files, $filesCount);
                $allSelectedFiles = array_merge($allSelectedFiles, $selectedFiles);
            }
        }

        return $allSelectedFiles;
    }

    private function selectRandomFiles(array $files, int $count): array
    {
        if ($count > count($files)) {
            return $files; // Вернем все файлы, если запрашиваемое количество больше доступного
        }

        $selectedFiles = array_rand($files, $count);

        // Преобразуем в массив, если был выбран один файл
        return is_array($selectedFiles) ? array_map(fn($key) => $files[$key], $selectedFiles) : [$files[$selectedFiles]];
    }

    private function prepareAttachments(array $allFiles): array
    {
        $attachments = [];

        foreach ($allFiles as $file) {
            $filePath = Storage::disk('local')->path($file);
            $attachments[] = [
                'file' => file_get_contents($filePath),
                'filename' => basename($filePath)
            ];
        }

        return $attachments;
    }

    private function upload(array $attachments, string $contentType, int $contentId): array
    {
        if (empty($attachments)) {
            return ['error' => 'No files provided'];
        }

        $folder = "{$contentType}/{$contentId}";
        $uploadedFiles = [];

        foreach ($attachments as $attachment) {
            if ($error = $this->validateAttachment($attachment)) {
                return ['error' => $error];
            }

            $fileSizeMB = strlen($attachment['file']) / (1024 * 1024);
            if ($error = $this->validateDirectory($folder, $fileSizeMB)) {
                return ['error' => $error];
            }

            $filename = $this->generateUniqueFilename($attachment, $folder);

            if (Storage::disk('sftp')->exists($filename)) {
                $uploadedFiles[] = ['filename' => $filename, 'message' => 'File already exists'];
                continue;
            }

            if ($error = $this->saveFileToSFTP($filename, $attachment['file'])) {
                return ['error' => $error];
            }

            $uploadedFiles[] = ['filename' => $filename];
        }

        return ['filenames' => $uploadedFiles];
    }

    private function validateAttachment(array $attachment): ?string
    {
        if (empty($attachment['file'])) {
            return 'File content is empty';
        }

        $fileSizeMB = strlen($attachment['file']) / (1024 * 1024);
        if ($fileSizeMB > self::MAX_FILE_SIZE_MB) {
            return "File exceeds maximum size of " . self::MAX_FILE_SIZE_MB . "MB";
        }

        return null;
    }

    private function validateDirectory(string $folder, float $fileSizeMB): ?string
    {
        $totalMediaSizeMB = $this->getDirectorySize('media') / (1024 * 1024);
        if (($totalMediaSizeMB + $fileSizeMB) > self::MAX_MEDIA_CAPACITY_MB) {
            return 'Media directory capacity exceeded';
        }

        $fileCount = count(Storage::disk('sftp')->files('media/' . $folder));
        if ($fileCount >= self::MAX_FILE_COUNT_PER_DIRECTORY) {
            return 'File limit in the current directory exceeded';
        }

        if (!$this->checkSFTPConnection()) {
            return 'SFTP is not available';
        }

        return null;
    }

    private function checkSFTPConnection(): bool
    {
        try {
            return Storage::disk('sftp')->exists('/');
        } catch (Exception $e) {
            Log::error('SFTP connection error: ' . $e->getMessage());
            return false;
        }
    }

    private function generateUniqueFilename(array $attachment, string $folder): string
    {
        $md5Hash = md5($attachment['file']);
        $extension = pathinfo($attachment['filename'], PATHINFO_EXTENSION);

        // Полный путь для сохранения файла с именем на основе MD5-хэша (с media для записи)
        return 'media/' . $folder . '/' . $md5Hash . '.' . $extension;
    }

    private function saveFileToSFTP(string $filePath, string $fileContent): ?string
    {
        try {
            Storage::disk('sftp')->put($filePath, $fileContent);
            return null;
        } catch (Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return 'File upload error';
        }
    }

    private function getUploadUrls(array $uploadResponse): ?array
    {
        if (!isset($uploadResponse['filenames'])) {
            Log::error('Upload failed: ' . json_encode($uploadResponse));
            return null;
        }

        return array_map(function ($file) {
            // Удаляем префикс media/ из пути к файлу для создания URL
            $filenameWithoutMedia = preg_replace('/^media\//', '', $file['filename']);
            return env('FILES_LINK', '') . $filenameWithoutMedia;
        }, $uploadResponse['filenames']);
    }

    private function getDirectorySize(string $directory): int
    {
        $size = 0;
        $files = Storage::disk('sftp')->allFiles($directory);

        foreach ($files as $file) {
            $size += Storage::disk('sftp')->size($file);
        }

        return $size;
    }
}
