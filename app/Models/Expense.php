<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Expense extends Model
{
    use HasFactory;

    protected $fillable = [
        'expense_name',
        'group_id',
        'user_id',
        'expense_description',
        'amount',
        'status',
        'expense_doc'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    // Accessors for formatted dates (appear in JSON automatically)
    public function getCreatedAtFormattedAttribute()
    {
        return $this->created_at
            ? $this->created_at->timezone('Asia/Kolkata')->format('d M Y h:i:s a')
            : null;
    }

    public function getUpdatedAtFormattedAttribute()
    {
        return $this->updated_at
            ? $this->updated_at->timezone('Asia/Kolkata')->format('d M Y h:i:s a')
            : null;
    }
}
