<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatIntent extends Model
{
    use HasFactory;

    protected $fillable = [
        'intent_name',
        'patterns',
        'responses',
        'description',
        'is_active',
    ];

    protected $casts = [
        'patterns' => 'array',
        'responses' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Scope for active intents only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
