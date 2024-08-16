<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserMetadata extends Model
{
    use HasFactory;

    protected $table = 'user_metadata';


    protected $primaryKey = 'user_id';
    public $incrementing = false;
    // protected $keyType = 'int';
    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'patronymic',
        'gender',
        'nickname',
        'profile_image_uri',
        'city',
        'birthday',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
}

