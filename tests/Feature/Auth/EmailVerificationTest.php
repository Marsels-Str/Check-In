<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;

class EmailVerificationTest extends TestCase
{
    // public function test_email_verification_screen_can_be_rendered()
    // {
    //     $user = User::where('email', 'example7@example.com')->firstOrFail();

    //     $response = $this->actingAs($user)->get('/verify-email');

    //     $response->assertStatus(200);
    // }

    // public function test_email_can_be_verified()
    // {
    //     $user = User::where('email', 'example7@example.com')->firstOrFail();

    //     Event::fake();

    //     $verificationUrl = URL::temporarySignedRoute(
    //         'verification.verify',
    //         now()->addMinutes(60),
    //         ['id' => $user->id, 'hash' => sha1($user->email)]
    //     );

    //     $response = $this->actingAs($user)->get($verificationUrl);

    //     Event::assertDispatched(Verified::class);
    //     $this->assertTrue($user->fresh()->hasVerifiedEmail());
    //     $response->assertRedirect(route('dashboard', absolute: false).'?verified=1');
    // }

    // public function test_email_is_not_verified_with_invalid_hash()
    // {
    //     $user = User::where('email', 'example7@example.com')->firstOrFail();

    //     // ensure the user starts unverified
    //     $user->forceFill([
    //         'email_verified_at' => null,
    //     ])->save();

    //     $verificationUrl = URL::temporarySignedRoute(
    //         'verification.verify',
    //         now()->addMinutes(60),
    //         ['id' => $user->id, 'hash' => sha1('wrong-email')]
    //     );

    //     $response = $this->actingAs($user)->get($verificationUrl);

    //     // Laravel should reject the request
    //     $response->assertStatus(403);

    //     // checks if user is still unverified by refreshing data
    //     $this->assertFalse($user->fresh()->hasVerifiedEmail());
    // }
}
