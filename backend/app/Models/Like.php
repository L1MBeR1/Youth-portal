<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    use HasFactory;

    protected $casts = [
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
        'user_id',
        'likeable_id',
        'likeable_type',
    ];

    public function likeable()
    {
        return $this->morphTo();
    }
}

