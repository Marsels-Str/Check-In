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
            'users.create',
            'users.view',
            'users.edit',
            'users.delete',
            'users.add',
            'users.remove',
            'roles.create',
            'roles.view',
            'roles.edit',
            'roles.delete',
            'roles.assign',
            'groups.create',
            'groups.view',
            'groups.show',
            'groups.edit',
            'groups.delete',
            'maps.create',
            'maps.add',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
