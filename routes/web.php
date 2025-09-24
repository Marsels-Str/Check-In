<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobGroupController;
use App\Http\Controllers\GroupImageController;
use App\Http\Controllers\Settings\ProfileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'ensure.profile.complete'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('about-us', function () {
        return Inertia::render('about-us');
    })->name('about-us');

    Route::get('contacts', function () {
        return Inertia::render('contacts');
    })->name('contacts');

    // Users
    Route::resource('users', UserController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:users.view');

    Route::get('/users/{user}/assign-role', [UserController::class, 'assignForm'])->name('users.roles.assign.form');
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.roles.assign');

    // Roles
    Route::resource('roles', RoleController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:roles.view');

    // Job Groups
    Route::resource('job-groups', JobGroupController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:groups.view');

    Route::post('job-groups/{id}/update-users', [JobGroupController::class, 'updateUsers'])
        ->name('job-groups.updateUsers')
        ->middleware('permission:groups.view');

    Route::put('job-groups/{id}/update-users', [JobGroupController::class, 'updateUsers'])
        ->name('job-groups.updateUsers');

    Route::post('/job-groups/{jobGroup}/images', [GroupImageController::class, 'store'])->name('job-groups.images.store');
    Route::delete('/group-images/{id}', [GroupImageController::class, 'destroy'])->name('groupImages.destroy');

    //Maps
    Route::resource('maps', MapController::class);
    Route::get('/maps/{id}/show', [MapController::class, 'show'])->name('maps.show');

    //Complete Profile
    Route::middleware('auth')->group(function () {
        Route::get('/complete-profile', [ProfileController::class, 'completeForm'])->name('profile.complete');
        Route::post('/complete-profile', [ProfileController::class, 'storeCompleteForm'])->name('profile.complete.store');
        Route::patch('settings/profile-data', [ProfileController::class, 'updateProfile'])->name('profile.data.update');
        Route::patch('settings/profile-portrait', [ProfileController::class, 'updatePortrait'])->name('profile.portrait.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
