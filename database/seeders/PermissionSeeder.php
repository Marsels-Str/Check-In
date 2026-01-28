<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionSeeder extends Seeder
{
    /**
        * Run the database seeds.
    */
    public function run(): void
    {
        $permissions = [

        // Lietotāju privilēģijas
        'users.create',
        'users.view',
        'users.show',
        'users.update',
        'users.delete',
        // Papildus privilēģijas
        'users.add',
        'users.remove',

        // Lomu privilēģijas
        'roles.create',
        'roles.view',
        'roles.show',
        'roles.update',
        'roles.delete',
        // Papildus privilēģija
        'roles.assign',

        // Kartes privilēģijas
        'maps.create',
        'maps.view',
        'maps.show',
        'maps.update',
        'maps.delete',

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
        'employees.view',
        'employees.add',
        'employees.remove',
        'employees.clockIn',
        'employees.clockOut',

        // Uzņēmumu izvēles privilēģija
        'business.access',
        'business.create',

        // Valodu privilēģijas
        'languages.access',
    ];

        $guards = ['web', 'business'];

        foreach ($permissions as $permission) {
            foreach ($guards as $guard) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => $guard,
                ]);
            }
        }
    }
}
