<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['body', 'author'];

    public function model()
    {
        return $this->morphTo();
    }
}
