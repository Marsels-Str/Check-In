<?php

use App\Models\Map;
use App\Models\User;

test('Lietotājs ar lomu Owner pievieno esošu karti grupai', function () {

    // Jau eksistējošs lietotājs ar lomu Owner
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Jau eksistējoša karte, kas tiks pievienota grupai
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

        // Tiek pārbaudīts vai karte ir redzama un tad tā tiek pievienota grupai
        ->assertSee('Map')
        ->click('map_id')
        ->click('Add Map')

        // Tiek sagaidīts apstiprinājums par veiksmīgu kartes pievienošanu grupai
        ->assertSee("Map #{$map->id}")
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});




// Lai šis tests strādātu ir nepieciešams izveidot mapi caur admin kontu:
// e-pasts: owner@example.com
// parole: password
// tad doties uz "Map" sadaļu un izveidot jaunu karti, admin uzņēmumam
