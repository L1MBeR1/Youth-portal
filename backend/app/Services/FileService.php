<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class FileService
{
    public function deleteFolder($path)
    {
        // Получаем список всех файлов и папок внутри указанного пути
        $files = Storage::disk('sftp')->allFiles($path);
        $directories = Storage::disk('sftp')->allDirectories($path);

        // Удаление всех файлов
        foreach ($files as $file) {
            Storage::disk('sftp')->delete($file);
        }

        // Удаление всех подкаталогов
        foreach ($directories as $directory) {
            Storage::disk('sftp')->deleteDirectory($directory);
        }

        // Удаление самой папки
        Storage::disk('sftp')->deleteDirectory($path);
    }

    public function copyFolder($source, $dest)
    {
        // Получаем все файлы и папки из исходного каталога
        $files = Storage::disk('sftp')->allFiles($source);
        $directories = Storage::disk('sftp')->allDirectories($source);

        // Создаем все подкаталоги в целевом каталоге
        foreach ($directories as $directory) {
            $newDirectory = str_replace($source, $dest, $directory);
            Storage::disk('sftp')->makeDirectory($newDirectory);
        }

        // Копируем все файлы в целевой каталог
        foreach ($files as $file) {
            $newFile = str_replace($source, $dest, $file);
            Storage::disk('sftp')->put($newFile, Storage::disk('sftp')->get($file));
        }
    }
}
