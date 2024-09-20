<?php

namespace App\Models;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Symfony\Component\HttpFoundation\Response;


class Comment extends Model
{
    use HasFactory;

    protected $casts = [
        'created_at' => 'datetime', 
        'updated_at' => 'datetime', 
    ];

    protected $guarded = [
        'id', 
        'created_at', 
        'updated_at', 
    ];

    protected $fillable = [
        'user_id',
        'content',
        'likes',
    ];

     // Общий метод для связи
     protected function relatedResource($relatedClass, $foreignKey)
     {
         return $this->belongsToMany($relatedClass, 'comment_to_resource', 'comment_id', $foreignKey)->withTimestamps();
     }
 
     // Метод для связи с подкастами
     public function podcast()
     {
         return $this->relatedResource(Podcast::class, 'podcast_id');
     }
 
     // Метод для связи с новостями
     public function news()
     {
         return $this->relatedResource(News::class, 'news_id');
     }
 
     // Метод для связи с блогами
     public function blogs()
     {
         return $this->relatedResource(Blog::class, 'blog_id');
     }

     protected static function boot() {
        parent::boot();

        static::creating(function ($comment) {
            $comment->checkForBadWords();
        });
    }

    public function checkForBadWords() {
        $bad_words = config('badwords.bad_words');
        Log::info('Плохие слова: ', $bad_words);
    
        if (is_array($bad_words)) {
            foreach ($bad_words as $word) {
                if (stripos($this->content, $word) !== false) {
                    return 'Ваш комментарий содержит недопустимые слова';
                }
            }
        } else {
            return 'Список недопустимых слов не найден.';
        }
    }
    
    

     public static function createComment($input, $resource_type, $resource_id)
     {
         // Создаем новый комментарий
         $comment = new Comment($input);
         $comment->user_id = Auth::id();
     
         // Проверяем на наличие плохих слов
         $badWordCheck = $comment->checkForBadWords();
         if ($badWordCheck) {
             // Если есть плохие слова, возвращаем null или сообщение об ошибке
             return null; 
         }
     
         $comment->save();
     
         // Связываем комментарий с ресурсом
         $commentToResource = new CommentToResource();
         $commentToResource->comment_id = $comment->id;
         $commentToResource->{$resource_type . '_id'} = $resource_id; 
     
         Log::info($input);
         
         // Если есть ответ на другой комментарий, сохраняем его
         if (isset($input['reply_to'])) {
             $commentToResource->reply_to = $input['reply_to'];
         }
         
         // Сохраняем связь с ресурсом
         $commentToResource->save();
     
         return $comment;
     }
     
     

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
    
}

