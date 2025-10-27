<?php

use App\Models\User;

test('Biznesa īpašnieks ieiet savā profilā dodas uz grupu sadaļu, izveido grupu un pievieno tai attēlu!', function () {
    config(['database.default' => 'mysql']);

    //ē-pasts priekš ieiešanas profilā
    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    //attēls
    $imagePath = base_path('tests/Fixtures/Stoli.png');
    expect(file_exists($imagePath))->toBeTrue('Test image not found at tests/Fixtures/Stoli.png');
    $imageBase64 = base64_encode(file_get_contents($imagePath));

    //ieiešana profilā un grupas izveide
    $page = visit('/')
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')
        ->click('Groups')
        ->click('Create')
        ->type('name', 'Test Group')
        ->type('description', 'Test Description')
        ->click('Save')
        ->click('Show');

    //pievieno attelu grupai
    $page->script("
        const hiddenInput = document.querySelector('input[name=\"image_base64\"]') 
            || document.createElement('input');
        hiddenInput.name = 'image_base64';
        hiddenInput.type = 'hidden';
        hiddenInput.value = '{$imageBase64}';
        document.querySelector('form').appendChild(hiddenInput);
    ");

    //saglabā attēlu
    $page->click('Upload')
    ->screenshot()
         ->assertSee('Test Group');
});

test('Neļauj pievienot tukšu lauku, ja attēls nav atlasīts!', function () {
    config(['database.default' => 'mysql']);

    $owner = User::where('email', 'owner@example.com')->firstOrFail();

        $page = visit('/')
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')
        ->click('Groups')
        ->click('Create')
        ->type('name', 'Test Group')
        ->type('description', 'Test Description')
        ->click('Save')
        ->click('Show')
        ->click('Upload')
        ->assertSee('An image is required.');
});
