<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Business;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(PermissionSeeder::class);
        $this->call(RoleSeeder::class);

        $owner = User::create([
            'name' => 'App Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $owner->assignRole('Owner');

        UserProfile::updateOrCreate(
            ['user_id' => $owner->id],
            [
                'age'           => 14,
                'height'        => 100.00,
                'weight'        => 40.00,
                'phone'         => '37100000000',
                'personal_code' => '000000-00000',
                'country'       => 'Latvijā',
                'city'          => 'Rigā',
                'portrait'      => null,
                'status'        => 1,
            ]
        );

        $business = Business::updateOrCreate(
            ['user_id' => $owner->id],
            [
                'name'        => 'AppOwner Business',
                'industry'    => 'Software',
                'email'       => 'business@example.com',
                'country'     => 'Latvijā',
                'phone'       => '37100000000',
                'city'        => 'Rigā',
                'address' => 'Owner Street',
                'description' => 'Main business for App Owner',
                'employees'   => 0,
                'logo'        => null,
            ]
        );

        $users = [
            ['name' => 'Dummy User1', 'email' => 'example1@example.com', 'role' => 'Unemployed'],
            ['name' => 'Dummy User2', 'email' => 'example2@example.com', 'role' => 'Unemployed'],
            ['name' => 'Dummy User3', 'email' => 'example3@example.com', 'role' => 'Unemployed'],
            ['name' => 'Dummy User4', 'email' => 'example4@example.com', 'role' => 'Unemployed'],
            ['name' => 'Dummy User5', 'email' => 'example5@example.com', 'role' => 'Unemployed'],
            ['name' => 'Dummy User6', 'email' => 'example6@example.com', 'role' => 'Unemployed'],
        ];

        foreach ($users as $data) {
            $user = User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            $user->syncRoles([$data['role']]);

            UserProfile::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'age' => rand(14, 100),
                    'height' => rand(100, 300),
                    'weight' => rand(40, 700),
                    'phone' => '371' . rand(10000000, 99999999),
                    'personal_code' => rand(100000, 999999) . '-' . rand(10000, 99999),
                    'country' => 'Latvija',
                    'city' => 'Rīga',
                    'portrait' => null,
                ]
            );
        }

    }
}
