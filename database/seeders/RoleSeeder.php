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
        $owner = Role::firstOrCreate(['name' => 'Owner']);
        $business = Role::firstOrCreate(['name' => 'Business']);
        $worker   = Role::firstOrCreate(['name' => 'Worker']);

        $allPermissions = Permission::all();

        $owner->givePermissionTo(Permission::all());

        $business->givePermissionTo([
            'groups.create',
            'groups.view',
            'groups.edit',
            'groups.delete',
            'users.add',
            'users.remove',
            'maps.create',
            'maps.add',
        ]);
        
        $worker->givePermissionTo([
            'groups.view',
        ]);
    }
}
