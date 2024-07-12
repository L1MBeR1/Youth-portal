<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = ['content', 'user_id'];

    public function blogs()
    {
        return $this->belongsTo(Blog::class, 'comment_to_resource', 'comment_id', 'blog_id');
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

    /*public function deleteComment()
    {
        // Удаление связанных записей в CommentToResource
        CommentToResource::where('comment_id', $this->id)->delete();
        
        // Удаление самого комментария
        return $this->delete();
    }*/

    public function updateComment($newContent)
    {
        $this->content = $newContent;
        $this->save();

        return $this;
    }
}

