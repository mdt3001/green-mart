<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'parent_id'
    ];

    // Quan hệ: Một category con thuộc về một category cha
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // Quan hệ: Một category cha có nhiều category con (Subcategories)
    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Quan hệ: Category có nhiều sản phẩm
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Đệ quy để lấy tất cả con cháu (nếu cần xử lý đa cấp sâu)
    public function childrenRecursive()
    {
        return $this->children()->with('childrenRecursive');
    }
}
