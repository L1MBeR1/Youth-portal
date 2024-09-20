<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $table = 'projects';

    protected $casts = [
        'description' => 'array',
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
   
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function events()
    {
        return $this->hasMany(Event::class, 'project_id');
    }
}
