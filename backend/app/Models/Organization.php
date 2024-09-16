<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;

    protected $table = 'organizations';

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
        'name',
        'description',
        'cover_uri',
    ];

    //public function users()
    //{
    //    return $this->belongsToMany(User::class, 'organizations_has_users', 'organization_id', 'user_id');
    //}
    
}
