<?php

use App\Models\User;

test('Lietotājs ar Owner lomu noņem eksistējošu lietotāju no grupas', function () {

    // Jau eksistējošs lietotājs ar lomu Owner
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Jau eksistējošs lietotājs, kurš tiks pievienots grupai
    $user = User::where('email', 'example1@example.com')->firstOrFail();

    // Tiek apmeklēta sākuma lapa
    visit('/')
        // Tiek veikta pierakstīšanās eksistējošā lietotāja kontā (Owner)
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')

        // Tiek atrasta grupu sadaļa un "show" links tajā
        ->click('Groups')
        // Lai šis tests strādātu ir jādodas uz (groups-desktop.tsx) failu un jāatkomentē aizkomentētā rindiņa
        ->click('[data-testid="show-trigger"]')

        // Tiek pārbaudīts vai lietotājs ir redzams un tad tiek noņemts no grupas
        ->assertSee($user->name)
        ->click('Remove')

        // Tiek sagaidīts apstiprinājums par veiksmīgu lietotāja noņemšanu no grupas
        ->assertDontSee($user->name)
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});
