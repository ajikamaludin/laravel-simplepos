<?php

namespace App\Models;

class Product extends Model
{
    protected $fillable = [
        'code',
        'name',
        'price',
        'cost',
        'stock',
        'category_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
