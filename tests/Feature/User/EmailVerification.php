<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Support\Facades\URL;

test('Eksistējošs Lietotājs spēj verificēt e-pastu', function () {

    // Lietotājs, kuram e-pasts nav verificēts
    $user = User::where('email', 'example6@example.com')->firstOrFail();

    // Pārliecinās, ka e-pasts ir neverificēts
    $user->forceFill([
        'email_verified_at' => null,
    ])->save();

    // Verifikācijas linka ģenerēšana
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]
    );

    // Tiek apmeklēta sākumlapa
    visit('/')
        // Tiek veikta pierakstīšanās
        ->click('Log in')
        ->type('email', $user->email)
        ->type('password', 'password')
        ->click('Log in')
        // Tiek veikta e-pasta verifikācija
        ->assertPathIs('/verify-email')
        ->navigate($verificationUrl)
        ->assertPathIs('/complete-profile');

    // Datubāzes pārbaude
    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});

test('Eksistējošs Lietotājs nespēj verificēt e-pastu', function () {

    // Lietotājs, kuram e-pasts nav verificēts
    $user = User::where('email', 'example6@example.com')->firstOrFail();

    // Pārliecinās, ka e-pasts ir neverificēts
    $user->forceFill([
        'email_verified_at' => null,
    ])->save();

    // Ģenerē e-pasta verifikācijas linku
    $verificationUrl = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]
    );
    // Padara šo linku nederīgu
    $invalidVerificationUrl = $verificationUrl.'&tampered=1';

    // Tiek apmeklēta sākumlapa
    visit('/')
        // Tiek veikta pierakstīšanās
        ->click('Log in')
        ->type('email', $user->email)
        ->type('password', 'password')
        ->click('Log in')
        // Tiek veikta e-pasta verifikācija
        ->assertPathIs('/verify-email')
        ->navigate($invalidVerificationUrl)
        ->assertSee('403');

    // Datubāzes pārbaude
    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});
