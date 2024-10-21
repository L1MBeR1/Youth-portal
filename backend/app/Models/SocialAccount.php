<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SocialAccount extends Model
{
    protected $table = 'social_accounts_auth'; 

    /**
     * Получить пользователя, которому принадлежит социальный аккаунт.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(UserLoginData::class, 'user_id');
    }

    protected $fillable = [
        'provider',
        'provider_user_id',
        'user_id',
    ];
}