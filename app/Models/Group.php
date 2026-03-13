<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
class Group extends Model
{
    use HasFactory;
    protected $table='groups';
    protected $fillable = ['group_name','group_description','status'];

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
