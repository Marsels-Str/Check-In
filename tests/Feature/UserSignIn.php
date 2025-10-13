<?php

it('may sign in the user', function () {
    Event::fake();

    $user = App\Models\User::factory()->make([
        'email' => 'owner@gmail.com',
        'password' => 'password',
    ]);

    $page = visit('/')->on()->mobile();
    $page->click('Sign In')
         ->assertUrlIs('/login')
         ->assertSee('Sign In to Your Account')
         ->fill('email', $user->email)
         ->fill('password', $user->password)
         ->click('Submit');

    $this->assertDatabaseHas('users', [
        'email' => $user->email,
        'password' => $user->password,
    ]);

    $this->assertAuthenticatedAs($user);

    Event::assertDispatched(UserLoggedIn::class);
});
