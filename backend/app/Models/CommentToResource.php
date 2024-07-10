<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommentToResource extends Model
{
    protected $table = 'comment_to_resource';
    protected $guarded = [];
    use HasFactory;
}
