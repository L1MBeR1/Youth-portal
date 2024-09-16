<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommentToResource extends Pivot
{
    use HasFactory;

    protected $table = 'comment_to_resource';
    public $timestamps = false;
    public $incrementing = false; 
    protected $primaryKey = null;

    protected $fillable = [
        'comment_id',
        'podcast_id',
        'blog_id',
        'news_id',
        'reply_to',
    ];
}
