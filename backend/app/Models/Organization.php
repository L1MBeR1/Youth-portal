<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;
    protected $fillable = ['name'];

    public function owner() // TODO: ???
    {
    }

    public function employees() // TODO: ?
    {
        return $this->belongsToMany(Comment::class, 'organization_has_users', 'organization_id', 'user_id');
    }
}
