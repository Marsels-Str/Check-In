<?php

namespace Tests\Feature\Settings;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PasswordUpdateTest extends TestCase
{
    // public function test_password_can_be_updated()
    // {
    //     $response = $this
    //         ->actingAs($user)
    //         ->from('/settings/password')
    //         ->put('/settings/password', [
    //             'current_password' => 'password',
    //             'password' => 'new-password',
    //             'password_confirmation' => 'new-password',
    //         ]);

    //     $response
    //         ->assertSessionHasNoErrors()
    //         ->assertRedirect('/settings/password');

    //     $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    // }

    // public function test_correct_password_must_be_provided_to_update_password()
    // {
    //     $response = $this
    //         ->actingAs($user)
    //         ->from('/settings/password')
    //         ->put('/settings/password', [
    //             'current_password' => 'wrong-password',
    //             'password' => 'new-password',
    //             'password_confirmation' => 'new-password',
    //         ]);

    //     $response
    //         ->assertSessionHasErrors('current_password')
    //         ->assertRedirect('/settings/password');
    // }
}
