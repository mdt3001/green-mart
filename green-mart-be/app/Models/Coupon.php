<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'code',
        'description',
        'discount',
        'for_new_user',
        'for_member',
        'is_public',
        'is_active',
        'expires_at',
    ];

    protected $casts = [
        'for_new_user' => 'boolean',
        'for_member' => 'boolean',
        'is_public' => 'boolean',
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'discount' => 'double',
    ];

    // Relationships
    public function stores()
    {
        return $this->belongsToMany(Store::class, 'coupon_store', 'coupon_code', 'store_id')
                    ->withPivot('is_enabled')
                    ->withTimestamps();
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'coupon_code', 'code');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where(function($q) {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    // Helper methods
    public function isExpired()
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isValid()
    {
        return $this->is_active && !$this->isExpired();
    }
}
