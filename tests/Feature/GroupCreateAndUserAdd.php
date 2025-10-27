<?php

use App\Models\User;

test('Biznesa īpašnieks ieiet profilā, pievieno darbinieku biznesam, izveido grupu un pievieno tai darbinieku!', function () {
    config(['database.default' => 'mysql']);

    // e-pasts priekš ieiešanas profilā
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // ieiešana profilā un darbinieka pievienošana
    $page = visit('/')
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')
        // darbinieka pievienošana uzņēmumam
        ->click('Employees')
        ->waitForText('Add New Employee', 2000)
        ->type('unique_id', '81369006')
        ->press('Search')
        ->assertSee('Tester')
        ->screenshot()
        ->click('Add Employee')
        ->assertSee('Tester');

    // grupas izveide
    $page->click('Groups')
        ->click('Create')
        ->type('name', 'Test Group')
        ->type('description', 'Test Description')
        ->click('Save')
        ->assertSee('Test Group')
        ->screenshot();

    // darbinieka pievienošana grupai
    $page->click('Show')
        ->assertSee('Users')
        ->click('Add User')
        ->assertSee('Tester')
        ->click('Tester')
        ->click('Add')
        ->assertSee('Tester')
        ->screenshot();
});
