<?php

namespace App\Models;

class SaleItem extends Model
{
    protected $fillable = [
        'sale_id',
        'product_id',
        'price',
        'cost',
        'quantity',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }
}
