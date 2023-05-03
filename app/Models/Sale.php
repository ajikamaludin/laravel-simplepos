<?php

namespace App\Models;

class Sale extends Model
{
    protected $fillable = [
        'code',
        'date',
        'customer_id',
        'total'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
