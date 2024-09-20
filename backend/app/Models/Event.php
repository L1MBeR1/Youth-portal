<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = 'events';

    protected $casts = [
        'address' => 'array', 
        'start_time' => 'datetime', 
        'end_time' => 'datetime', 
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
        'address',
        'cover_uri',
        'longitude',
        'latitude',
        'views',
        'start_time',
        'end_time',
        'author_id',
        'project_id',
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
