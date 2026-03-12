<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword;

class PasswordResetTest extends TestCase
{
    // private function clearResetTokenFor(User $user): void
    // {
    //     DB::table('password_reset_tokens')->where('email', $user->email)->delete();
    // }

    // public function test_reset_password_link_screen_can_be_rendered(): void
    // {
    //     $this->get('/forgot-password')->assertOk();
    // }

    // public function test_reset_password_link_can_be_requested(): void
    // {
    //     Notification::fake();

    //     $user = User::where('email', 'example1@example.com')->firstOrFail();
    //     $this->clearResetTokenFor($user);

    //     $this->post('/forgot-password', ['email' => $user->email])->assertStatus(302);

    //     Notification::assertSentTo($user, ResetPassword::class);
    // }

    // public function test_reset_password_screen_can_be_rendered(): void
    // {
    //     Notification::fake();

    //     $user = User::where('email', 'example1@example.com')->firstOrFail();
    //     $this->clearResetTokenFor($user);

    //     $this->post('/forgot-password', ['email' => $user->email])->assertStatus(302);

    //     Notification::assertSentTo($user, ResetPassword::class, function ($notification) {
    //         $this->get('/reset-password/' . $notification->token)->assertOk();
    //         return true;
    //     });
    // }

    // public function test_password_can_be_reset_with_valid_token(): void
    // {
    //     Notification::fake();

    //     $user = User::where('email', 'example1@example.com')->firstOrFail();
    //     $this->clearResetTokenFor($user);

    //     $this->post('/forgot-password', ['email' => $user->email])->assertStatus(302);

    //     Notification::assertSentTo($user, ResetPassword::class, function ($notification) use ($user) {
    //         $this->post('/reset-password', [
    //             'token' => $notification->token,
    //             'email' => $user->email,
    //             'password' => 'password',
    //             'password_confirmation' => 'password',
    //         ])->assertSessionHasNoErrors()
    //           ->assertRedirect(route('login'));

    //         return true;
    //     });
    // }
}
