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

        $user = User::create([
            'name' => 'App Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ]);

        $user->assignRole('Owner');

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'age'           => 14,
                'height'        => 100.00,
                'weight'        => 40.00,
                'phone'         => '37100000000',
                'personal_code' => '000000-00000',
                'country'       => 'Latvijā',
                'city'          => 'Rigā',
                'portrait'      => null,
                'unique_id'     => env('APP_OWNER_UNIQUE_ID'),
            ]
        );

        $business = Business::updateOrCreate(
            ['user_id' => $user->id],
            [
                'name'        => 'AppOwner Business',
                'industry'    => 'Software',
                'email'       => 'business@example.com',
                'country'     => 'Latvijā',
                'phone'       => '37100000000',
                'city'        => 'Rigā',
                'street_address' => 'Owner Street',
                'description' => 'Main business for App Owner',
                'employees'   => 0,
                'logo'        => null,
            ]
        );
    }
}
