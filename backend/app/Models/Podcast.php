<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    use HasFactory;

    protected $table = 'podcasts';

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
        'updated_at', 
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
        'author_id',
    ];

    const STATUSES = ['moderating', 'published', 'archived', 'pending'];

    public function comments()
    {
        return $this->belongsToMany(Comment::class, 'comment_to_resource', 'podcast_id', 'comment_id')->withTimestamps();
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
