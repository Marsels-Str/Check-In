<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('about-us', function () {
        return Inertia::render('about-us');
    })->name('about-us');

    Route::get('contacts', function () {
        return Inertia::render('contacts');
    })->name('contacts');

    Route::get('job-group', function () {
        return Inertia::render('job-group');
    })->name('job-group');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
