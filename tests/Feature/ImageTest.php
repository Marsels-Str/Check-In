<?php

use App\Models\User;

it('logs in as App Owner, creates a job group for his own business and uploads an image (Base64)', function () {
    config(['database.default' => 'mysql']);

    $owner = User::where('email', 'owner@example.com')->firstOrFail();

    // Path to your real image (put it anywhere in your project)
    $imagePath = base_path('tests/Fixtures/Stoli.png');
    expect(file_exists($imagePath))->toBeTrue('Test image not found at tests/Fixtures/Stoli.png');

    // Convert to base64
    $imageBase64 = base64_encode(file_get_contents($imagePath));

    $page = visit('/')
        ->click('Log in')
        ->type('email', $owner->email)
        ->type('password', 'password')
        ->click('Log in')
        ->click('Groups')
        ->click('Create')
        ->type('name', 'Test Group')
        ->type('description', 'Test Description')
        ->click('Select Business')
        ->click('AppOwner Business')
        ->click('Save')
        ->click('Show');

    // ✅ Inject Base64 directly into a hidden field instead of <input type="file">
    $page->script("
        const hiddenInput = document.querySelector('input[name=\"image_base64\"]') 
            || document.createElement('input');
        hiddenInput.name = 'image_base64';
        hiddenInput.type = 'hidden';
        hiddenInput.value = '{$imageBase64}';
        document.querySelector('form').appendChild(hiddenInput);
    ");

    $page->click('Upload')
    ->screenshot()
         ->assertSee('Test Group');
});

it('fails to upload when no image is provided', function () {
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
        ->click('Select Business')
        ->click('AppOwner Business')
        ->click('Save')
        ->click('Show')
        ->click('Upload')
        ->assertSee('An image is required.');
});
