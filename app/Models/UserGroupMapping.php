<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
class UserGroupMapping extends Model
{
    protected $fillable = [
        'user_id',
        'group_id',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
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