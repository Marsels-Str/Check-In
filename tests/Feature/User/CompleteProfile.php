<?php

namespace Tests\Feature\User;

use App\Models\User;

test('Eksistējošs lietotājs spēj aizpildīt padziļināto profila informāciju', function () {
	$user = User::where('email', 'example6@example.com')->firstOrFail();

	// Pārliecinās vai viss ir sagatavots
	$user->markEmailAsVerified();
	$user->profile()?->delete();

    // Tiek apmeklēta sākumlapa
	visit('/')
        // Tiek veikta pierakstīšanās
		->click('Log in')
		->type('[name="email"]', $user->email)
		->type('[name="password"]', 'password')
		->click('Log in')
        // Tiek aizpildīti datu lauki pareizi
		->assertPathIs('/complete-profile')
		->type('age', '27')
		->type('height', '180')
		->type('weight', '80')
		->type('country', 'Latvia')
		->type('city', 'Riga')
		->type('phone', '+37120000001')
		->type('personal_code', '010101-12345')
		->click('Save')
		->assertPathIs('/profile/after-complete');

    // Pārliecinās, ka datubāzē ir saglabāti pareizie dati
	$this->assertDatabaseHas('user_profiles', [
		'user_id' => $user->id,
		'age' => 27,
		'height' => '180.00',
		'weight' => '80.00',
		'country' => 'Latvia',
		'city' => 'Riga',
		'phone' => '37120000001',
		'personal_code' => '010101-12345',
	]);
});

test('Eksistējošs lietotājs nespēj aizpildīt padziļināto profila informāciju', function () {
	$user = User::where('email', 'example6@example.com')->firstOrFail();

	// Pārliecinās vai viss ir sagatavots
	$user->markEmailAsVerified();
	$user->profile()?->delete();

    // Tiek apmeklēta sākumlapa
	visit('/')
        // Tiek veikta pierakstīšanās
		->click('Log in')
		->type('[name="email"]', $user->email)
		->type('[name="password"]', 'password')
		->click('Log in')
        // Tiek aizpildīti datu lauki nepareizi
		->assertPathIs('/complete-profile')
		->type('age', '10')
		->type('height', '20')
		->type('weight', '10')
		->type('country', '12')
		->type('city', '123')
		->type('phone', '123')
		->type('personal_code', 'invalid')
		->click('Save')
		->assertPathIs('/complete-profile');

    // Pārliecinās, ka datubāzē nav saglabāti nepareizie dati
	expect($user->fresh()->profile)->toBeNull();
});
