<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;

    protected $table = 'user_login_data';

    /**
     * Атрибуты, которые могут быть присвоены массово.
     *
     * @var array
     */
    protected $fillable = [
        'name', //TODO: проверить в 'user_login_data,...'
        'email',
        'password',
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
        $permissions = $this->getPermissionsViaRoles();        // Получение коллекции Permission (Spatie)
        $permissions = $permissions->pluck('name')->toArray(); // Извлечение полей 'name' и преобразование в массив

        return [
            'email' => $this->email,
            'roles' => $this->getRoleNames(),
            'permissions' => $permissions,
        ];
    }
}