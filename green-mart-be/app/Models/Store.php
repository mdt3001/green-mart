<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory, HasUuids;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'name',
        'description',
        'username',
        'address',
        'status',
        'is_active',
        'logo',
        'email',
        'contact',
        'reject_reason',
        'BRCTaxCode',
        'BRCNumber',
        'BRCDateOfissue',
        'BRCPlaceOfissue',
        'BRCImages',
    ];


    protected $casts = [
        'BRCDateOfissue' => 'date',
        'BRCImages' => 'array', // Lưu JSON dưới dạng array
        'is_active' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function flashSaleProducts()
    {
        return $this->hasMany(FlashSaleProduct::class);
    }
}
