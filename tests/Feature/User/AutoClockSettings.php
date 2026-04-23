<?php

namespace Tests\Feature\User;

use App\Models\AutoClockSettings;
use App\Models\Business;
use App\Models\User;
use Tests\TestCase;

test('Eksistējošs lietotājs spēj aizpildīt automātisko e-pastu izsūtīšanas informāciju', function () {
	$user = User::where('email', 'example6@example.com')->firstOrFail();

	// Pievieno lietotāju uzņēmumam
	$business = Business::firstOrFail();
	$user->businesses()->syncWithoutDetaching([$business->id]);

	// Tiek apmeklēta sākumlapa
	visit('/login')
		// Tiek veikta pierakstīšanās
		 ->type('email', $user->email)
		 ->type('password', 'password')
		 ->click('Log in')
		// Tiek atrasti un aizpildīti datu lauki pareizi
		->navigate('/settings/auto-clock')
		->assertPathIs('/settings/auto-clock')
		->type('work_start', '09:00')
		->type('work_end', '18:00')
		->type('lunch_start', '12:00')
		->type('lunch_end', '13:00')
		->click('Save')
		->assertPathIs('/settings/auto-clock');

	// Pārliecinās, ka datubāzē ir saglabāti pareizie dati
	$this->assertDatabaseHas('auto_clock_settings', [
		'user_id' => $user->id,
		'work_start' => '09:00:00',
		'work_end' => '18:00:00',
		'lunch_start' => '12:00:00',
		'lunch_end' => '13:00:00',
	]);
});

test('Eksistējošs lietotājs nespēj aizpildīt automātisko e-pastu izsūtīšanas informāciju', function () {
	$user = User::where('email', 'example6@example.com')->firstOrFail();

	// Pievieno lietotāju uzņēmumam
	$business = Business::firstOrFail();
	$user->businesses()->syncWithoutDetaching([$business->id]);

	// Pārliecinās vai viss ir sagatavots
	AutoClockSettings::where('user_id', $user->id)->delete();

	// Tiek apmeklēta sākumlapa
	visit('/login')
		// Tiek veikta pierakstīšanās
		->type('email', $user->email)
		->type('password', 'password')
		->click('Log in')
		// Netiek aizpildīti datu lauki
		->navigate('/settings/auto-clock')
		->assertPathIs('/settings/auto-clock')
		->click('Save')
		->assertPathIs('/settings/auto-clock');

	// Pārliecinās, ka datubāzē nav saglabāti nepareizie dati
	$this->assertDatabaseMissing('auto_clock_settings', [
		'user_id' => $user->id,
		'work_start' => '09:00:00',
		'work_end' => '18:00:00',
	]);
});
