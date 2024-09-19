<?php

namespace App\Http\Controllers\FileSystems;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    // Ограничения
    private const MAX_MEDIA_CAPACITY_MB = 500;
    private const MAX_FILE_SIZE_MB = 50;
    private const MAX_FILE_COUNT_PER_DIRECTORY = 100;

    /**
     * Загрузка файла
     * 
     * Загружает новый файл на сервер и сохраняет его с именем на основе MD5-хэша.
     * 
     * @group Файлы
     * 
     * @urlParam content_type string required Тип контента. Пример: images.
     * @urlParam content_id int required ID контента. Пример: 123.
     * @bodyParam file file required Файл, который нужно загрузить. Примеры: image/jpeg, image/png, image/gif.
     */
    public function upload(Request $request, $content_type, $content_id)
    {
        $folder = "{$content_type}" . "/{$content_id}";

        // Определяем, загружен ли один файл или несколько
        $files = $request->hasFile('files') ? $request->file('files') : [$request->file('file')];

        if (empty($files)) {
            return response()->json(['error' => 'No files uploaded'], 400);
        }

        $uploadedFiles = [];

        foreach ($files as $file) {
            // Логирование MIME-типа загруженного файла
            Log::info('Uploaded file MIME type: ' . $file->getMimeType());

            // Проверка на корректность файла
            if (!$file->isValid()) {
                return response()->json(['error' => 'One of the files is not valid'], 400);
            }

            // Проверка размера загружаемого файла
            $fileSizeMB = $file->getSize() / (1024 * 1024);
            if ($fileSizeMB > self::MAX_FILE_SIZE_MB) {
                return response()->json(['error' => "One of the files exceeds the maximum allowed size of " . self::MAX_FILE_SIZE_MB . "MB"], 413);
            }

            // Проверка общего размера папки media до загрузки файла
            $totalMediaSizeMB = $this->getDirectorySize('media') / (1024 * 1024);
            $newTotalSizeMB = $totalMediaSizeMB + $fileSizeMB;

            if ($newTotalSizeMB > self::MAX_MEDIA_CAPACITY_MB) {
                return response()->json(['error' => 'Media directory capacity exceeded'], 507);
            }

            // Проверка числа файлов в текущей директории
            $filesCount = count(Storage::disk('sftp')->files('media/' . $folder));
            if ($filesCount >= self::MAX_FILE_COUNT_PER_DIRECTORY) {
                return response()->json(['error' => 'File limit in the current directory exceeded'], 507);
            }

            // Проверка доступности SFTP
            try {
                if (!Storage::disk('sftp')->exists('/')) {
                    return response()->json(['error' => 'SFTP is not available'], 503);
                }
            } catch (Exception $e) {
                Log::error('SFTP connection error: ' . $e->getMessage());
                return response()->json(['error' => 'SFTP connection error'], 503);
            }

            // Проверка типа файла
            $allowedMimeTypes = [
                'image/jpeg',
                'image/webp',
                'image/jpg',
                'image/png',
                'image/gif',
                'text/plain',
                'audio/mpeg',
            ];
            if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
                return response()->json(['error' => 'Unsupported file type'], 415);
            }

            // Вычисление MD5-хэша файла
            $md5Hash = md5_file($file->getRealPath());
            $extension = $file->getClientOriginalExtension();

            // Полный путь для сохранения файла с именем на основе MD5-хэша
            $filePath = 'media/' . $folder . '/' . $md5Hash . '.' . $extension;
            $filename = 'http://127.0.0.1:8000/api/files/' . $folder . '/' . $md5Hash . '.' . $extension;

            // Проверка на существование файла с таким хэшем
            if (Storage::disk('sftp')->exists($filePath)) {
                $uploadedFiles[] = ['filename' => $filename, 'message' => 'File already exists'];
                continue;
            }

            // Сохранение файла на SFTP
            try {
                Storage::disk('sftp')->put($filePath, file_get_contents($file->getRealPath()));
                $uploadedFiles[] = ['filename' => $filename];
            } catch (Exception $e) {
                Log::error('File upload error: ' . $e->getMessage());
                return response()->json(['error' => 'File upload error'], 500);
            }
        }

        // Возвращаем результат
        if (count($uploadedFiles) === 1) {
            // Возвращаем один файл, если был загружен только один файл
            return response()->json($uploadedFiles[0]);
        }

        // Возвращаем массив файлов
        return response()->json(['filenames' => $uploadedFiles]);
    }


    private function generateUniqueShortId($folderPath, $extension): string
    {
        do {
            // Генерация короткого уникального ID
            $shortId = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 6);
            $filePath = $folderPath . '/' . $shortId . '.' . $extension;
        } while (Storage::disk('sftp')->exists($filePath));

        return $shortId;
    }


    /**
     * Загрузка файла
     * 
     * Скачивает файл с сервера по его имени.
     * 
     * @group Файлы
     * 
     * @urlParam filename string required Имя файла для загрузки. Пример: 9a0364b9e99bb480dd25e1f0284c8555.png.
     * 
     */
    public function download(Request $request, $content_type, $content_id, $filename)
    {
        // Проверка доступности SFTP
        if (!Storage::disk('sftp')->exists('/')) {
            return response()->json(['error' => 'SFTP is not available'], 503);
        }

        // Проверка существования файла на SFTP
        $filePath = 'media/' . $content_type . '/' . $content_id . '/' . $filename;
        if (!Storage::disk('sftp')->exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Получение файла с SFTP
        $fileSize = Storage::disk('sftp')->size($filePath);
        $fileStream = Storage::disk('sftp')->readStream($filePath);
        $mimeType = Storage::disk('sftp')->mimeType($filePath);

        // Проверяем, запрашивает ли клиент частичный контент
        $headers = [
            'Content-Type' => $mimeType,
            'Content-Length' => $fileSize,
            'Accept-Ranges' => 'bytes',
        ];

        // Обработка заголовка Range для частичной загрузки
        if ($request->hasHeader('Range')) {
            $range = $request->header('Range');
            list(, $range) = explode('=', $range, 2);
            $range = explode('-', $range);
            $start = intval($range[0]);
            $end = isset($range[1]) && is_numeric($range[1]) ? intval($range[1]) : $fileSize - 1;

            $length = $end - $start + 1;

            $headers['Content-Range'] = "bytes $start-$end/$fileSize";
            $headers['Content-Length'] = $length;

            // Чтение и возврат части файла
            fseek($fileStream, $start);
            $partialContent = fread($fileStream, $length);

            return response($partialContent, 206, $headers);
        }

        // Возвращаем полный файл, если не запрашивались байты
        return response()->stream(function () use ($fileStream) {
            fpassthru($fileStream);
        }, 200, $headers);
    }





    /**
     * Обновление файла
     * 
     * Удаляет существующий файл и загружает новый файл на его место.
     * 
     * @group Файлы
     * 
     * @urlParam content_type string required Тип контента. Пример: images.
     * @urlParam content_id int required ID контента. Пример: 123.
     * @urlParam filename string required Имя файла, который нужно обновить. Пример: 9a0364b9e99bb480dd25e1f0284c8555.png.
     * @bodyParam file file required Новый файл, который нужно загрузить. Примеры: image/jpeg, image/png, image/gif.
     */
    public function update(Request $request, $content_type, $content_id, $filename)
    {
        $folder = "{$content_type}/{$content_id}";
        $filePath = 'media/' . $folder . '/' . $filename;

        // Проверка наличия файла в запросе
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No file uploaded'], 400);
        }

        // Проверка на корректность загруженного файла
        $file = $request->file('file');
        if (!$file->isValid()) {
            return response()->json(['error' => 'File is not valid'], 400);
        }

        // Проверка размера загружаемого файла
        $fileSizeMB = $file->getSize() / (1024 * 1024);
        if ($fileSizeMB > self::MAX_FILE_SIZE_MB) {
            return response()->json(['error' => "File size exceeds the maximum allowed size of " . self::MAX_FILE_SIZE_MB . "MB"], 413);
        }

        // Проверка общего размера папки media до загрузки файла
        $totalMediaSizeMB = $this->getDirectorySize('media') / (1024 * 1024);
        $newTotalSizeMB = $totalMediaSizeMB + $fileSizeMB;

        if ($newTotalSizeMB > self::MAX_MEDIA_CAPACITY_MB) {
            return response()->json(['error' => 'Media directory capacity exceeded'], 507);
        }

        // Проверка числа файлов в текущей директории
        $filesCount = count(Storage::disk('sftp')->files('media/' . $folder));
        if ($filesCount >= self::MAX_FILE_COUNT_PER_DIRECTORY) {
            return response()->json(['error' => 'File limit in the current directory exceeded'], 507);
        }

        // Проверка типа файла (например, изображение)
        $allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain',
        ];
        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            return response()->json(['error' => 'Unsupported file type'], 415);
        }

        // Проверка доступности SFTP перед загрузкой
        try {
            if (!Storage::disk('sftp')->exists('/')) {
                return response()->json(['error' => 'SFTP is not available'], 503);
            }
        } catch (Exception $e) {
            Log::error('SFTP connection error: ' . $e->getMessage());
            return response()->json(['error' => 'SFTP connection error'], 503);
        }

        // Вычисление MD5-хэша нового файла
        $md5Hash = md5_file($file->getRealPath());
        $extension = $file->getClientOriginalExtension();

        // Полный путь для нового файла
        $newFilePath = 'media/' . $folder . '/' . $md5Hash . '.' . $extension;

        // Проверка на существование нового файла с таким хэшем
        if (Storage::disk('sftp')->exists($newFilePath)) {
            return response()->json(['path' => $newFilePath, 'message' => 'File already exists']);
        }

        // Попытка загрузить новый файл, но без удаления старого
        try {
            Storage::disk('sftp')->put($newFilePath, file_get_contents($file->getRealPath()));
        } catch (Exception $e) {
            Log::error('File upload error: ' . $e->getMessage());
            return response()->json(['error' => 'File upload error'], 500);
        }

        // Удаление старого файла
        $deleteResponse = $this->delete($content_type, $content_id, $filename);
        if ($deleteResponse->status() !== 200) {
            // Если удаление старого файла не удалось, нужно откатить загрузку нового
            Storage::disk('sftp')->delete($newFilePath);
            return response()->json(['error' => 'File update error: could not delete old file'], 500);
        }

        return response()->json(['path' => $newFilePath]);
    }


    /**
     * Удаление файла
     * 
     * Удаляет файл с сервера по его имени.
     * 
     * @group Файлы
     * 
     * @urlParam content_type string required Тип контента. Пример: images.
     * @urlParam content_id int required ID контента. Пример: 123.
     * @urlParam filename string required Имя файла, который нужно удалить. Пример: 9a0364b9e99bb480dd25e1f0284c8555.png.
     */
    public function delete($content_type, $content_id, $filename)
    {
        $filePath = 'media/' . "{$content_type}/{$content_id}/" . $filename;

        // Проверка доступности SFTP
        try {
            if (!Storage::disk('sftp')->exists('/')) {
                return response()->json(['error' => 'SFTP is not available'], 503);
            }
        } catch (Exception $e) {
            Log::error('SFTP connection error: ' . $e->getMessage());
            return response()->json(['error' => 'SFTP connection error'], 503);
        }

        // Проверка существования файла
        if (!Storage::disk('sftp')->exists($filePath)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        // Удаление файла с SFTP
        try {
            Storage::disk('sftp')->delete($filePath);
        } catch (Exception $e) {
            Log::error('File deletion error: ' . $e->getMessage());
            return response()->json(['error' => 'File deletion error'], 500);
        }

        return response()->json(['message' => 'File deleted successfully'], 200);
    }



    /**
     * Получение размера директории
     */
    private function getDirectorySize($directory): int
    {
        $size = 0;
        $files = Storage::disk('sftp')->allFiles($directory);

        foreach ($files as $file) {
            $size += Storage::disk('sftp')->size($file);
        }

        return $size;
    }


    private function getFolderFromReferer($referer)
    {
        // Логика для извлечения папки из URL реферера
        // Например, если папка указана в части URL после домена
        if ($referer) {
            $parsedUrl = parse_url($referer);
            $path = $parsedUrl['path'] ?? '';

            // Разделение пути и получение последнего сегмента
            $segments = explode('/', trim($path, '/'));
            return end($segments);
        }

        return null;
    }

    public function clearAllSftpFiles()
    {
        // Проверка, имеет ли пользователь роль суперпользователя
        if (!auth()->user() || !auth()->user()->hasRole('su')) {
            return response()->json(['error' => 'Доступ запрещен. У вас нет прав суперпользователя.'], 403);
        }

        try {
            // Получаем список всех файлов и папок в корневой директории
            $files = Storage::disk('sftp')->allFiles('/');
            $directories = Storage::disk('sftp')->allDirectories('/');

            // Удаляем все файлы
            foreach ($files as $file) {
                Storage::disk('sftp')->delete($file);
                Log::info("Удален файл: {$file}");
            }

            // Удаляем все директории
            foreach ($directories as $directory) {
                Storage::disk('sftp')->deleteDirectory($directory);
                Log::info("Удалена директория: {$directory}");
            }

            return response()->json(['message' => 'Все файлы и директории успешно удалены.']);
        } catch (Exception $e) {
            Log::error('Ошибка при очистке SFTP: ' . $e->getMessage());
            return response()->json(['error' => 'Ошибка при очистке файлов на SFTP'], 500);
        }
    }



}
