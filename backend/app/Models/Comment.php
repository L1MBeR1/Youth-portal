<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'user_id']; // массовое присвоение атрибутов

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

    public static function createComment($input, $resource_type, $resource_id)
    {
        $comment = new Comment($input);
        $comment->user_id = Auth::id();
        $comment->save();

        $commentToResource = new CommentToResource();
        $commentToResource->comment_id = $comment->id;
        $commentToResource->{$resource_type . '_id'} = $resource_id; 
        $commentToResource->save();

        return $comment;
    }

    public function updateComment($newContent)
    {
        $this->content = $newContent;
        $this->save();

        return $this;
    }
}

