<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobGroupController;
use App\Http\Controllers\GroupImageController;
use App\Http\Controllers\BusinessEmployeeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\BusinessProfileController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'ensure.profile.complete'])->group(function () {
    // Dashboard & static pages
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
    Route::get('about-us', fn () => Inertia::render('about-us'))->name('about-us');
    Route::get('contacts', fn () => Inertia::render('contacts'))->name('contacts');

    // Users
    Route::resource('users', UserController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:users.view');

    Route::get('/users/{user}/assign-role', [UserController::class, 'assignForm'])->name('users.roles.assign.form');
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.roles.assign');

    Route::resource('roles', RoleController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:roles.view');

    // Job Groups
    Route::resource('job-groups', JobGroupController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:groups.view');

    Route::post('/job-groups/{group}/users', [JobGroupController::class, 'updateUsers'])->name('job-groups.update-users');
    Route::delete('/job-groups/{group}/users/{user}', [JobGroupController::class, 'removeUser'])->name('job-groups.removeUser');

    Route::post('/job-groups/{jobGroup}/images', [GroupImageController::class, 'store'])->name('job-groups.images.store');
    Route::delete('/group-images/{id}', [GroupImageController::class, 'destroy'])->name('groupImages.destroy');

    Route::post('/job-groups/{jobGroup}/attach-map', [JobGroupController::class, 'attachMap'])->name('job-groups.attachMap');

    // Maps
    Route::resource('maps', MapController::class);

    // Profiles
    Route::get('/complete-profile', [ProfileController::class, 'completeForm'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileController::class, 'storeCompleteForm'])->name('profile.complete.store');

    Route::get('/complete-business', [BusinessProfileController::class, 'edit'])->name('business.complete');
    Route::post('/complete-business', [BusinessProfileController::class, 'store'])->name('business.complete.store');

    Route::get('/profile/after-complete', fn () => Inertia::render('complete-profiles/after-complete'))->name('profile.afterComplete');
    
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::get('settings/profile', [BusinessProfileController::class, 'edit'])->name('profile.edit');
    Route::post('settings/business', [BusinessProfileController::class, 'update'])->name('business.update');

    Route::post('settings/profile-portrait', [ProfileController::class, 'updatePortrait'])->name('profile.portrait.update');
    Route::delete('settings/profile-portrait', [ProfileController::class, 'removePortrait'])->name('profile.portrait.remove');

    // Employees
    Route::get('/employees', [BusinessEmployeeController::class, 'index'])->name('users.employees.index');
    Route::post('/employees', [BusinessEmployeeController::class, 'store'])->name('users.employees.store');
    Route::delete('/employees/{user}', [BusinessEmployeeController::class, 'remove'])->name('users.employees.remove');
    Route::get('/employees/search', [BusinessEmployeeController::class, 'search'])->name('employees.search');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
