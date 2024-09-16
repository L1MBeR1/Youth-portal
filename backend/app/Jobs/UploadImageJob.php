<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UploadImageJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $blogId;
    protected $filePath;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($blogId, $filePath)
    {
        $this->blogId = $blogId;
        $this->filePath = $filePath;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Загрузка изображения через HTTP-запрос
        $response = Http::attach(
            'file', 
            file_get_contents($this->filePath), 
            basename($this->filePath)
        )->post("http://127.0.0.1:8000/api/files/blogs/{$this->blogId}/");

        if ($response->successful()) {
            Log::info("Image uploaded successfully for blog ID: {$this->blogId}");
        } else {
            Log::error("Failed to upload image for blog ID: {$this->blogId}");
        }
    }
}
