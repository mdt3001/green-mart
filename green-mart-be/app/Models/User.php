<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'email',
        'password',
        'status',
        'phone_number',
        'address',
        'image',
        'cart',
        'activation_token',
        'google_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'activation_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',  // Tự động hash khi assign
        'cart' => 'array',
        'status' => 'string',
    ];

    // Relationships (giữ nguyên many-to-many roles)
    public function stores()
    {
        return $this->hasOne(Store::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }

    public function ratings()
    {
        return $this->hasMany(Rating::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }
}
