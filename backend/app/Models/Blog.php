<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    protected $guarded = [];
    use HasFactory;

    protected $casts = [
        'description' => 'array',
    ];

    protected $hidden = [
        'draft_for'
    ];

    // protected $fillable = ['status'];

    public function comments()
    {
        return $this->belongsToMany(Comment::class, 'comment_to_resource', 'blog_id', 'comment_id');
    }

    public function author(){

        return $this->belongsTo(User::class, 'author_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}


