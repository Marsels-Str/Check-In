<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\JobGroupController;
use App\Http\Controllers\AutoClockController;
use App\Http\Controllers\GroupImageController;
use App\Http\Controllers\BusinessEmployeeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\BusinessProfileController;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified', 'ensure.profile.complete'])->group(function () {
    //Dashboard & static pages
    Route::get('dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');
    Route::get('about-us', fn () => Inertia::render('about-us'))->name('about-us');
    Route::get('contacts', fn () => Inertia::render('contacts'))->name('contacts');

    //Users
    Route::resource('users', UserController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:users.view');

    Route::get('/users/{user}/assign-role', [UserController::class, 'assignForm'])->name('users.roles.assign.form');
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.roles.assign');

    Route::patch('/users/{user}/update-user-profile', [ProfileController::class, 'update'])->name('users.update-user-profile');

    //Roles
    Route::resource('roles', RoleController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:roles.view');

    //Job Groups
    Route::resource('job-groups', JobGroupController::class)
        ->only(['index', 'create', 'store', 'show', 'edit', 'update', 'destroy'])
        ->middleware('permission:groups.view');

    Route::post('/job-groups/{group}/users', [JobGroupController::class, 'updateUsers'])->name('job-groups.update-users');
    Route::delete('/job-groups/{group}/users/{user}', [JobGroupController::class, 'removeUser'])->name('job-groups.removeUser');
    Route::post('/job-groups/{jobGroup}/images', [GroupImageController::class, 'store'])->name('job-groups.images.store');
    Route::delete('/group-images/{id}', [GroupImageController::class, 'destroy'])->name('groupImages.destroy');
    Route::post('/job-groups/{jobGroup}/attach-map', [JobGroupController::class, 'attachMap'])->name('job-groups.attachMap');

    //Maps
    Route::resource('maps', MapController::class);
    Route::get('/maps/{map}/index', [MapController::class, 'index'])->name('maps.index');

    //Profile Complete
    Route::get('/complete-profile', [ProfileController::class, 'create'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileController::class, 'store'])->name('profile.complete.store');

    //After Profile Complete choice
    Route::get('/profile/after-complete', fn () => Inertia::render('complete-profiles/after-complete'))->name('profile.afterComplete')->middleware('after.profile.complete.access');

    //Business Complete
    Route::get('/complete-business', [BusinessProfileController::class, 'create'])->name('business.complete')->middleware('after.business.complete.access');
    Route::post('/complete-business', [BusinessProfileController::class, 'store'])->name('business.store');
    Route::post('/complete-business/cancel', [BusinessProfileController::class, 'cancel'])->name('business.cancel');

    //Business Settings
    Route::get('/settings/business', [BusinessProfileController::class, 'edit'])->name('business.edit');
    Route::post('/settings/business', [BusinessProfileController::class, 'update'])->name('business.update');

    //Profile Portrait management
    Route::post('/profile-portrait', [ProfileController::class, 'updatePortrait'])->name('profile.portrait.update');
    Route::delete('/profile-portrait', [ProfileController::class, 'removePortrait'])->name('profile.portrait.remove');

    //Business Logo management
    Route::post('/business/logo', [BusinessProfileController::class, 'updateLogo'])->name('business.updateLogo');
    Route::delete('/business/logo', [BusinessProfileController::class, 'removeLogo'])->name('business.removeLogo');

    //Employees
    Route::get('/employees', [BusinessEmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [BusinessEmployeeController::class, 'store'])->name('employees.store');
    Route::delete('/employees/{user}', [BusinessEmployeeController::class, 'remove'])->name('employees.remove');
    Route::get('/employees/search', [BusinessEmployeeController::class, 'search'])->name('employees.search');
    Route::post('/employees/{user}/clock-in', [BusinessEmployeeController::class, 'clockIn'])->name('employees.clockin');
    Route::post('/employees/{user}/clock-out', [BusinessEmployeeController::class, 'clockOut'])->name('employees.clockout');

    //Auto clock login
    Route::get('/auto-clock/login-clockin/{token}', [AutoClockController::class, 'loginClockIn'])->name('auto-clock.login-clockin');
    Route::get('/auto-clock/extend-work/{token}', [AutoClockController::class, 'extendWorkEmail'])->name('auto-clock.extend-work-email');
    Route::get('/auto-clock/after-login', [AutoClockController::class, 'handleAfterLogin'])->name('auto-clock.after-login');

    //Auto Clock
    Route::get('/settings/auto-clock', [AutoClockController::class, 'index'])->name('auto-clock.edit');
    Route::put('/settings/auto-clock', [AutoClockController::class, 'update'])->name('auto-clock.update');
    Route::post('/settings/auto-clock/extend', [AutoClockController::class, 'extendWork'])->name('auto-clock.extend');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
