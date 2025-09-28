<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'description',
        'discount',
        'for_new_user',
        'for_member',
        'is_public',
        'expires_at',
    ];

    protected $casts = [
        'for_new_user' => 'boolean',
        'for_member' => 'boolean',
        'is_public' => 'boolean',
    ];
}
