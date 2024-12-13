<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsRoleStatus extends Model
{
    use HasFactory;

    protected $table = 'news_role_status';

    protected $casts = [
        'status' => 'string', 
        'created_at' => 'datetime', 
        'updated_at' => 'datetime', 
    ];

    protected $hidden = [
        'moder_id', 
    ];

    protected $guarded = [
        'id', 
        'created_at', 
        'updated_at', 
    ];

    protected $fillable = [
        'status',
        'moder_id',
        'author_id',
        'content',
    ];

    public function author(){

        return $this->belongsTo(User::class, 'author_id');
    }

    public function moderator()
    {
        return $this->belongsTo(UserMetadata::class, 'moder_id', 'user_id');
    }


}
