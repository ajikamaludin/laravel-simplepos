<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissions = [
            ['id' => Str::uuid(), 'label' => 'View Dashboard', 'name' => 'view-dashboard'],

            ['id' => Str::uuid(), 'label' => 'Create User', 'name' => 'create-user'],
            ['id' => Str::uuid(), 'label' => 'Update User', 'name' => 'update-user'],
            ['id' => Str::uuid(), 'label' => 'View User', 'name' => 'view-user'],
            ['id' => Str::uuid(), 'label' => 'Delete User', 'name' => 'delete-user'],

            ['id' => Str::uuid(), 'label' => 'Create Role', 'name' => 'create-role'],
            ['id' => Str::uuid(), 'label' => 'Update Role', 'name' => 'update-role'],
            ['id' => Str::uuid(), 'label' => 'View Role', 'name' => 'view-role'],
            ['id' => Str::uuid(), 'label' => 'Delete Role', 'name' => 'delete-role'],

            ['id' => Str::uuid(), 'label' => 'Create Customer', 'name' => 'create-customer'],
            ['id' => Str::uuid(), 'label' => 'Update Customer', 'name' => 'update-customer'],
            ['id' => Str::uuid(), 'label' => 'View Customer', 'name' => 'view-customer'],
            ['id' => Str::uuid(), 'label' => 'Delete Customer', 'name' => 'delete-customer'],

            ['id' => Str::uuid(), 'label' => 'Create Category', 'name' => 'create-category'],
            ['id' => Str::uuid(), 'label' => 'Update Category', 'name' => 'update-category'],
            ['id' => Str::uuid(), 'label' => 'View Category', 'name' => 'view-category'],
            ['id' => Str::uuid(), 'label' => 'Delete Category', 'name' => 'delete-category'],

            ['id' => Str::uuid(), 'label' => 'Create Product', 'name' => 'create-product'],
            ['id' => Str::uuid(), 'label' => 'Update Product', 'name' => 'update-product'],
            ['id' => Str::uuid(), 'label' => 'View Product', 'name' => 'view-product'],
            ['id' => Str::uuid(), 'label' => 'Delete Product', 'name' => 'delete-product'],

            ['id' => Str::uuid(), 'label' => 'Create Sale', 'name' => 'create-sale'],
            ['id' => Str::uuid(), 'label' => 'Update Sale', 'name' => 'update-sale'],
            ['id' => Str::uuid(), 'label' => 'View Sale', 'name' => 'view-sale'],
            ['id' => Str::uuid(), 'label' => 'Delete Sale', 'name' => 'delete-sale'],
            
        ];

        foreach($permissions as $permission) {
            Permission::insert($permission);
        }

        $role = Role::create(['name' => 'admin']);

        $permissions = Permission::all();
        foreach($permissions as $permission) {
            $role->rolePermissions()->create(['permission_id' => $permission->id]);
        }

        User::create([
            'name' => 'Super Administrator',
            'email' => 'root@admin.com',
            'password' => bcrypt('password'),
        ]);

        $admin = User::create([
            'name' => 'Administator',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'role_id' => $role->id,
        ]);

        $setting = [
        ];

        Setting::insert($setting);
    }
}
