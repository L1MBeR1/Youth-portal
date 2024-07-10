<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'comments';
    protected $guarded = [];
    use HasFactory;

    public function blogs()
    {
        return $this->belongsToMany(Blog::class, 'comment_to_resource', 'comment_id', 'blog_id');
    }

    public function news()
    {
        return $this->belongsToMany(Blog::class, 'comment_to_resource', 'comment_id', 'news_id');
    }
}
