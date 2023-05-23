<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Carbon;

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

    public function formatedDate(): Attribute
    {
        return Attribute::make(
            get: function () {
                return Carbon::parse($this->date)->format('d/m/Y');
            }
        );
    }
}
