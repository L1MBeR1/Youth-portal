<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Podcast extends Model
{
    use HasFactory;
    protected $table = 'podcasts';
    protected $guarded = [];
    protected $casts = [
        'description' => 'array',
    ];
    public function comments()
    {
        return $this->belongsToMany(Comment::class, 'comment_to_resource', 'podcast_id', 'comment_id')->withTimestamps();
    }

    /*public function user()
    {
        return $this->belongsTo(User::class);
    }*/

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
