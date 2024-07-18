<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';
    protected $guarded = [];

    /**
     * Get the comments associated with the news.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<int, Comment>
     */
    public function comments(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(
            Comment::class,
            'comment_to_resource',
            'news_id',
            'comment_id'
        )->withTimestamps();
    }
}