<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed permissions
        $this->call(PermissionSeeder::class);

        // 2. Then seed roles
        $this->call(RoleSeeder::class);

        // Example fixed profile
        $user = User::factory()->create([
            'name' => 'App Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'), // set a known password
        ]);

        // Assign the AppOwner role (from Spatie)
        $user->assignRole('AppOwner');
    }
}
