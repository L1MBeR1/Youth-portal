<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organization extends Model
{
    use HasFactory;
    protected $table = 'organizations';
    protected $fillable = ['name','status'];
    protected $attributes = [
        'status' => 'moderating',
    ];
    const STATUSES = ['moderating', 'approved', 'rejected'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'organizations_has_users', 'organization_id', 'user_id');
    }
    
    public function owner() // TODO: ???
    {
    }

    public function employees() // TODO: ?
    {
        return $this->belongsToMany(Organization::class, 'organization_has_users', 'organization_id', 'user_id');
    }
}
