<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the AppOwner role
        $role = Role::create(['name' => 'AppOwner']);

        // Optional: give AppOwner all permissions
        $role->givePermissionTo(Permission::all());
    }
}
