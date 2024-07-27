<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommentToResource extends Pivot
{
    protected $table = 'comment_to_resource';

    public $timestamps = false;
    protected $guarded = [];
    use HasFactory;
}
