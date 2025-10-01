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

        $user = User::factory()->create([
            'name' => 'App Owner',
            'email' => 'owner@example.com',
            'password' => Hash::make('password'),
        ]);

        $user->assignRole('Owner');

        UserProfile::updateOrCreate(
            ['user_id' => $user->id],
            [
                'age'           => 30,
                'height'        => 180.00,
                'weight'        => 75.00,
                'phone'         => '20000000',
                'personal_code' => '010100-12345',
                'country'       => 'Latvia',
                'city'          => 'Riga',
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
                'country'     => 'Latvia',
                'phone'       => '20000000',
                'city'        => 'Riga',
                'street_address' => '123 App Street',
                'description' => 'Main business for App Owner.',
                'employees'   => 0,
                'logo'        => null,
            ]
        );
    }
}
