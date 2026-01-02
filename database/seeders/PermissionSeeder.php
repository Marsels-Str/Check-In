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
        $groups = [

        // Lietotāju privilēģijas
        'users' => [
            'users.create',
            'users.view',
            'users.show',
            'users.update',
            'users.delete',
            // Papildus privilēģijas
            'users.add',
            'users.remove',
        ],

        // Lomu privilēģijas
        'roles' => [
            'roles.create',
            'roles.view',
            'roles.show',
            'roles.update',
            'roles.delete',
            // Papildus privilēģija
            'roles.assign',
        ],

        // Kartes privilēģijas
        'maps' => [
            'maps.create',
            'maps.view',
            'maps.show',
            'maps.update',
            'maps.delete',
        ],

        // Darba grupu privilēģijas
        'groups' => [
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
        ],

        // Darbinieku privilēģijas
        'employees' => [
            'employees.view',
            'employees.add',
            'employees.remove',
            'employees.clockIn',
            'employees.clockOut',
        ],

        // Uzņēmumu izvēles privilēģija
        'business' => [
            'business.access',
            'business.create',
        ],

        'diagrams' => [
            'diagrams.view',
        ],
    ];

        foreach ($groups as $groupName => $permissions) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate(['name' => $permission, 'group' => $groupName]);
            }
        }
    }
}
