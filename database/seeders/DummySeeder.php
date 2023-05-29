<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DummySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (['makanan', 'minuman'] as $cat) {
            $category = Category::create(['name' => $cat]);
        }

        $products = [
            'Roti Tawar',
            'Indomie',
            'Telur Omega 3',
            'Enervonche',
            'Teh Olong',
            'Teh Celup',
            'Bakpi',
            'Multivitamin',
            'Kopi Kapal Api',
            'White Kopi',
            'Coklat',
            'Perment',
            'Galon',
            'Sabun',
            'Jam',
            'Minyak Goreng',
            'Tissue',
            'Tissue Basah',
            'Sandal',
            'Payung',
            'Handwash',
            'Beras',
            'Kaos',
            'Sepatu',
            'Obat Nyamuk'
        ];
        foreach ($products as $prod) {
            Product::create([
                'code' => Str::upper(Str::random(6)),
                'name' => $prod,
                'price' => rand(1000, 10000),
                'cost' => rand(1000, 10000),
                'stock' => rand(1, 99),
                'category_id' => $category->id,
            ]);
        }

        foreach (['Customer A', 'Customer B'] as $cust) {
            Customer::create([
                'code' => Str::upper(Str::random(6)),
                'name' => $cust,
            ]);
        }
    }
}
