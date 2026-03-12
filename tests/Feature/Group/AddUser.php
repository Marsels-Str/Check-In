<?php

use App\Models\User;

test('Lietotājs ar Owner lomu pievieno eksistējošu lietotāju grupai', function () {

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

        // Tiek pārbaudīts vai lietotājs ir redzams un tad tiek pievienots grupai
        ->assertSee('Users')
        ->click('Add User')
        ->click($user->name)
        ->click('Add')

        // Tiek sagaidīts apstiprinājums par veiksmīgu lietotāja pievienošanu grupai
        ->assertSee($user->name)
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});




// Lai šis tests strādātu ir nepieciešams augstāk esošā lietotāja konta "unique_id", ko var iegūt vienkārši pieslēdzoties šim kontam:
// e-pasts: example1@example.com
// parole: password
// tad uz ekrāna parādīsies opcija kļūt par uzņēmuma kontu vai darbinieka kontu (jā vai nē), priekš šī testa nepieciešams darbinieks,
// tātad ir jāizvēlas opcija nē, "no, skip" un jādodas uz profila sadaļu pēc tam, jānospiež "open", lai redzētu virtuālo id karti,
// kur ir parādīts "unique_id" uzreiz zem lietotāja vārda, piemērs: ID: 00000000 ir nepieciešami tikai šie cipari
// tad ir jāpiereģistrējas ar admin kontu, kas ir:
// e-pasts: owner@example.com
// parole: password
// un jādodas uz "employee" sadaļu un izmantojot šo "unique_id" pievienot lietotāju savam uzņēmumam, kurš būs pieejams admin kontam un viss!
