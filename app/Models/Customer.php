<?php

namespace App\Models;

class Customer extends Model
{
    protected $fillable = [
        'code',
        'name',
        'address',
        'phone',
    ];
}
