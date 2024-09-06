<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $table = 'user_login_data';

    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email',  
        'password', 
        'phone',
    ];

    /**
     * Атрибуты, которые должны быть скрыты для сериализации.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     * Получить список атрибутов для приведения к типу
     * 
     * @return array
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function metadata()
    {
        return $this->hasOne(UserMetadata::class, 'user_id');
    }

    public function blogs(){
        return $this->hasMany(Blog::class, 'author_id');
    }

    public function news(){
        return $this->hasMany(News::class, 'author_id');
    }


    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        // Получение разрешений для пользователя
        $permissions = $this->getPermissionsViaRoles()->pluck('name')->toArray();
        $login = $this->email ?? $this->phone;

        return [
            'login' => $login,
            'roles' => $this->getRoleNames(),
            'permissions' => $permissions,
        ];
    }
    public function organizations()
{
    return $this->belongsToMany(Organization::class, 'organizations_has_users', 'user_id', 'organization_id');
}

}