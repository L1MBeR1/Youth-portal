<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    use HasFactory;

    // protected static function booted()
    // {
    //     static::addGlobalScope('onlyWithExistingAuthors', function (Builder $builder) {
    //         $builder->whereHas('author', function ($query) {
    //             $query->whereNull('deleted_at');
    //         });
    //     });
    // }

    protected $casts = [
        'description' => 'array',
        'status' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $guarded = [
        'id',
        // 'author_id', // для черновиков
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
        'draft_for',
        'author_id', // для черновиков
    ];

    protected $hidden = [
        'draft_for'
    ];

    public function comments()
    {
        return $this->belongsToMany(Comment::class, 'comment_to_resource', 'blog_id', 'comment_id');
    }

    public function author()
    {

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

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}


