<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $table = 'news';

    protected $casts = [
        'description' => 'array',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $hidden = [

    ];

    protected $guarded = [
        'id',
        'created_at',
        // 'updated_at',
    ];

    protected $fillable = [
        'title',
        'description',
        'content',
        'cover_uri',
        'status',
        'views',
        'likes',
        'reposts',
        'author_id', // для черновиков
    ];

    const STATUSES = ['moderating', 'published', 'archived', 'pending'];

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

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

}