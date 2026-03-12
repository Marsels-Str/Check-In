<?php

use App\Models\Map;
use App\Models\User;

test('Lietotājs ar lomu Owner noņem esošu karti no grupas', function () {

    // Jau eksistējošs lietotājs ar lomu Owner
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Jau eksistējoša karte, kas tiks noņemta no grupas
    $map = Map::firstOrFail();

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

        // Tiek pārbaudīts vai karte ir redzama un tad tā tiek noņemta no grupas
        ->assertSee('detach')
        ->click('[data-testid="map-' . $map->id . '-detach-trigger"]')

        // Tiek sagaidīts apstiprinājums par veiksmīgu kartes noņemšanu no grupas
        ->assertDontSee('detach')
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});
