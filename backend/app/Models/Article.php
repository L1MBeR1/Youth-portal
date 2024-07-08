<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title', 'body'];

    public function comments()
    {
        return $this->morphMany(Comment::class, 'model');
    }

}
