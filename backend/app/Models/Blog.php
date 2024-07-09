<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Blog extends Model
{
    protected $guarded = [];
    // protected $fillable = ['title', 'description', 'image'];

    use HasFactory;
}


