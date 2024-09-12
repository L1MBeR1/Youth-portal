<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;
    protected $table = 'projects';
    protected $guarded = [];
    protected $casts = [
        'description' => 'array',
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
