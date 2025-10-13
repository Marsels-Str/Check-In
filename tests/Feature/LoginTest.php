<?php

it('logs in as App Owner', function () {
    config(['database.default' => 'mysql']);

    $page = visit('/')
        ->click('Log in')
        ->type('email', 'owner@example.com')
        ->type('password', 'password')
        ->click('Log in')
        ->assertUrlIs('/dashboard');
});
