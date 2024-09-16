<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogRoleStatus extends Model
{
    use HasFactory;

    protected $table = 'blog_role_status';

    protected $fillable = [
        'status',
        'author_id',
    ];

    public function author(){

        return $this->belongsTo(User::class, 'author_id');
    }

    public function moderator()
    {
        return $this->belongsTo(UserMetadata::class, 'moder_id', 'user_id');
    }


}
