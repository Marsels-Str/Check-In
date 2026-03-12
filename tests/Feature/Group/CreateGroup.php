<?php

use App\Models\User;
use App\Models\Business;

test('Lietoājs ar Owner lomu izveido grupu', function () {

    // Jau eksistējošs lietotājs ar lomu Owner
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Jau eksistējošs uzņēmums, kas saistīts ar lietotāju Owner
    $business = Business::where('user_id', $owner->id)->firstOrFail();

    // Tiek apmeklēta sākuma lapa
    visit('/')
        // Tiek veikta pierakstīšanās eksistējošā lietotāja kontā (Owner)
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')

        // Tiek atrasta grupu sadaļa un izveidota jauna grupa
        ->click('Groups')
        ->click('Create')

        ->type('name', 'Test Group')
        ->type('description', 'Test group')

        // Šis variants strādā tikai tad ja iestatīta angļu valoda,
        // kas jau ir, kā oriģinālā [default] valoda, bet ja nu tiek nomanītā šis variants nestrādās!!!
        // Tāpēc izmantot zemāk esošo variantu, kas strādā neatkarīgi no valodas iestatījumiem
        
        ->click('- select business -')
        ->click($business->name)

        // Lai šis testa variants strādātu ir jādodas uz (business-dropdown-menu.tsx) failu un jāpievieno aizkomentētā rindiņa pogai, 
        // kā arī jāatkomentē aizkomentētā rindiņa, kas atrodas zemāk tajā pašā failā

        // ->click('[data-testid="business-dropdown-trigger"]')
        // ->click('[data-testid="business-' . $business->id . '"]')

        ->click('Save')

        // Tiek sagaidīts apstiprinājums par veiksmīgu grupas izveidi
        ->assertSee('Test Group')
        // Tiek veikts ekrānuzņēmums, kā pierādījums
        ->screenshot();
});
