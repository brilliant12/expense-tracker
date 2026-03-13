<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExpenseSummary extends Model
{
    use HasFactory;

    protected $table = 'expense_summary';

    protected $fillable = [
        'group_id',
        'user_id',
        'month',
        'total_amount',
    ];

    // Relationships
    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
