<?php

namespace App\Models;

class Product extends Model
{
    const ACTIVE = 0;

    const INACTIVE = 1;

    protected $fillable = [
        'code',
        'name',
        'price',
        'cost',
        'stock',
        'category_id',
        'is_active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class)->withTrashed();
    }
}
