<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    protected $casts = [
        'description' => 'array',
    ];
    protected $table = 'news';
    protected $guarded = [];

    const STATUSES = ['moderating', 'published', 'archived', 'pending'];

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

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }

}