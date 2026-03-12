<?php

use App\Models\User;
use App\Models\Business;

test('Lietoājs ar Owner lomu izdzēš grupu', function () {

    // Jau eksistējošs lietotājs ar lomu Owner
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Tiek apmeklēta sākuma lapa
    visit('/')
        // Tiek veikta pierakstīšanās eksistējošā lietotāja kontā (Owner)
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')

        // Tiek atrasta grupu sadaļa un izdzēsta esošā grupa
        ->click('Groups')
        // Lai šis tests strādātu ir jādodas uz (groups-desktop.tsx) failu un jāatkomentē aizkomentētā rindiņa pie "delete" pogas
        ->click('[data-testid="delete-trigger"]')

        // Tiek sagaidīts apstiprinājums par veiksmīgu grupas dzēšanu
        ->assertDontSee('Test Group')
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});
