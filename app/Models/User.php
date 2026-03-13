<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Carbon;
class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;  

    /**
     * Mass assignable attributes
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_code',
        'two_factor_expires_at',
        'status'
    ];

    /**
     * Hidden attributes
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_code',
    ];

    /**
     * Cast attributes
     */
    protected $casts = [
        'email_verified_at'       => 'datetime',
        'two_factor_expires_at'   => 'datetime',
    ];
    public function expenses()
{
    return $this->hasMany(Expense::class);
}
public function groups()
{
    return $this->belongsToMany(Group::class, 'user_group_mappings');
}
// Format created_at
    public function getCreatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d M Y h:i:s a');
    }

    // Format updated_at
    public function getUpdatedAtAttribute($value)
    {
        return Carbon::parse($value)->format('d M Y h:i:s a');
    }

}
