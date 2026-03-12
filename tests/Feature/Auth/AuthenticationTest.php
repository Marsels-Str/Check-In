<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;

class AuthenticationTest extends TestCase
{
    // public function test_login_screen_can_be_rendered()
    // {
    //     $response = $this->get('/login');

    //     $response->assertStatus(200);
    // }

    // public function test_users_can_authenticate_using_the_login_screen()
    // {
    //     $user = User::where('email', 'example1@example.com')->firstOrFail();

    //     $response = $this->post('/login', [
    //         'email' => $user->email,
    //         'password' => 'password',
    //     ]);

    //     $this->assertAuthenticated();
    //     $response->assertRedirect(route('dashboard', absolute: false));
    // }

    // public function test_users_can_not_authenticate_with_invalid_password()
    // {
    //     $user = User::where('email', 'example1@example.com')->firstOrFail();

    //     $this->post('/login', [
    //         'email' => $user->email,
    //         'password' => 'wrong-password',
    //     ]);

    //     $this->assertGuest();
    // }

    // public function test_users_can_logout()
    // {
    //     $user = User::where('email', 'example1@example.com')->firstOrFail();

    //     $response = $this->actingAs($user)->post('/logout');

    //     $this->assertGuest();
    //     $response->assertRedirect('/');
    // }
}
