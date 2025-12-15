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
        $worker   = Role::firstOrCreate(['name' => 'Unemployed']);

        $allPermissions = Permission::all();

        $owner->givePermissionTo(Permission::all());

        $business->givePermissionTo([
            // Darba grupu privilēģijas
            'groups.create',
            'groups.view',
            'groups.show',
            'groups.update',
            'groups.delete',
            // Papildus privilēģijas
            'groups.attachMap',
            'groups.detachMap',
            'groups.addUsers',
            'groups.removeUsers',
            'groups.addImage',
            'groups.removeImage',

            // Darbinieku privilēģijas
            'users.view',
            'users.add',
            'users.remove',
            
            // Kartes privilēģijas
            'maps.create',
            'maps.view',
            'maps.show',
            'maps.update',
            'maps.delete',

            // Lomu privilēģijas
            'roles.create',
            'roles.view',
            'roles.show',
            'roles.update',
            'roles.delete',
            // Papildus privilēģija
            'roles.assign',

            // Darbinieku privilēģijas
            'employees.view',
            'employees.add',
            'employees.remove',
            'employees.clockIn',
            'employees.clockOut',

            // Uzņēmuma privilēģijas
            'business.create',
        ]);
        
        $worker->givePermissionTo([
            'groups.view',
            'business.create',
        ]);
    }
}
