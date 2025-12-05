<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
	use HasFactory, Notifiable, HasApiTokens, HasUuids;

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
		'verification_code',
		'verification_code_expires_at',
		'google_id',
		'password_reset_code',
		'password_reset_code_expires_at',
	];

	protected $hidden = [
		'password',
		'remember_token',
		'password_reset_token',
		'verification_code',
	];

	protected $casts = [
		'email_verified_at' => 'datetime',
		'password' => 'hashed',
		'cart' => 'array',
		'status' => 'string',
		'password_reset_code_expires_at' => 'datetime',
		'verification_code_expires_at' => 'datetime',
	];

	public function stores()
	{
		return $this->hasOne(Store::class);
	}

	public function store()
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

	public function savedCoupons()
	{
		return $this->belongsToMany(Coupon::class, 'user_coupons', 'user_id', 'coupon_code', 'id', 'code')
					->withTimestamps();
	}
}