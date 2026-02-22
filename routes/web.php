<?php

use Inertia\Inertia;

use App\Models\Group;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\MapController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TranslationController;
use App\Http\Controllers\Groups\GroupController;
use App\Http\Controllers\BusinessEmployeeController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Groups\GroupImageController;
use App\Http\Controllers\Groups\GroupMessageController;
use App\Http\Controllers\Settings\BusinessProfileController;

Route::get('/', fn () => Inertia::render('welcome'))->name('home');

Route::middleware(['auth', 'verified', 'ensure.profile.complete', 'after.complete.access'])->group(function () {
    //Dashboard & static pages
    Route::get('about-us', fn () => Inertia::render('about-us'))->name('about-us');
    Route::get('contacts', fn () => Inertia::render('contacts'))->name('contacts');

    // Dashboard
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    //Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index')->middleware('permission:users.view');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create')->middleware('permission:users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware('permission:users.create');
    Route::patch('/users/{user}/update-user-profile', [ProfileController::class, 'update'])->name('users.update-user-profile');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show')->middleware('permission:users.show');
    Route::get('/users/edit/{user}', [UserController::class, 'edit'])->name('users.edit')->middleware('permission:users.update');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('permission:users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('permission:users.delete');
    Route::post('/users/{user}/assign-role', [UserController::class, 'assignRole'])->name('users.roles.assign');
    Route::get('/users/{user}/assign-role', [UserController::class, 'assignForm'])->name('users.roles.assign.form');

    //Roles
    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index')->middleware('permission:roles.view');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store')->middleware('permission:roles.create');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create')->middleware('permission:roles.create');
    Route::get('/roles/{role}', [RoleController::class, 'show'])->name('roles.show')->middleware('permission:roles.show');
    Route::put('/roles/{role}', [RoleController::class, 'update'])->name('roles.update')->middleware('permission:roles.update');
    Route::get('/roles/edit/{role}', [RoleController::class, 'edit'])->name('roles.edit')->middleware('permission:roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('roles.destroy')->middleware('permission:roles.delete');

    //Maps
    Route::get('/maps', [MapController::class, 'index'])->name('maps.index')->middleware('permission:maps.view');
    Route::post('/maps', [MapController::class, 'store'])->name('maps.store')->middleware('permission:maps.create');
    Route::get('/maps/{map}', [MapController::class, 'show'])->name('maps.show')->middleware('permission:maps.show');
    Route::get('/maps/{map}/edit', [MapController::class, 'edit'])->name('maps.edit')->middleware('permission:maps.update');
    Route::put('/maps/{map}', [MapController::class, 'update'])->name('maps.update')->middleware('permission:maps.update');
    Route::delete('/maps/{map}', [MapController::class, 'destroy'])->name('maps.destroy')->middleware('permission:maps.delete');
    
    //Groups
    Route::get('/groups', [GroupController::class, 'index'])->name('groups.index')->middleware('permission:groups.view');
    Route::get('/groups/create', [GroupController::class, 'create'])->name('groups.create')->middleware('permission:groups.create');
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store')->middleware('permission:groups.create');
    Route::get('/groups/{group}', [GroupController::class, 'show'])->name('groups.show')->middleware('permission:groups.show');
    Route::put('/groups/{group}', [GroupController::class, 'update'])->name('groups.update')->middleware('permission:groups.update');
    Route::get('/groups/{group}/edit', [GroupController::class, 'edit'])->name('groups.edit')->middleware('permission:groups.update');
    Route::delete('/groups/{group}', [GroupController::class, 'destroy'])->name('groups.destroy')->middleware('permission:groups.delete');
    Route::post('/groups/{group}/attach-map', [GroupController::class, 'attachMap'])->name('groups.attach-map')->middleware('permission:groups.attachMap');
    Route::delete('/groups/{group}/detach-map', [GroupController::class, 'detachMap'])->name('groups.detach-map')->middleware('permission:groups.detachMap');
    Route::post('/groups/{group}/users', [GroupController::class, 'updateUsers'])->name('groups.update-users')->middleware('permission:groups.addUsers');
    Route::delete('/groups/{group}/users/{user}', [GroupController::class, 'removeUser'])->name('groups.remove-users')->middleware('permission:groups.removeUsers');
    Route::delete('/groups/images/{id}', [GroupImageController::class, 'destroy'])->name('groupImages.destroy')->middleware('permission:groups.removeImage');
    Route::post('/groups/{group}/images', [GroupImageController::class, 'store'])->name('groups.images.store')->middleware('permission:groups.addImage');

    //Employees
    Route::get('/employees', [BusinessEmployeeController::class, 'index'])->name('employees.index')->middleware('permission:employees.view');
    Route::post('/employees', [BusinessEmployeeController::class, 'store'])->name('employees.store')->middleware('permission:employees.add');
    Route::post('/employees/search', [BusinessEmployeeController::class, 'search'])->name('employees.search')->middleware('permission:employees.view');
    Route::delete('/employees/{user}', [BusinessEmployeeController::class, 'remove'])->name('employees.remove')->middleware('permission:employees.remove');
    Route::post('/employees/{user}/clock-in', [BusinessEmployeeController::class, 'clockIn'])->name('employees.clockin')->middleware('permission:employees.clockIn');
    Route::post('/employees/{user}/clock-out', [BusinessEmployeeController::class, 'clockOut'])->name('employees.clockout')->middleware('permission:employees.clockOut');

    //Profile Complete
    Route::get('/complete-profile', [ProfileController::class, 'create'])->name('profile.complete');
    Route::post('/complete-profile', [ProfileController::class, 'store'])->name('profile.complete.store');

    //After Profile Complete choice
    Route::get('/profile/after-complete', fn () => Inertia::render('complete-profiles/after-complete'))->name('profile.afterComplete');
    Route::post('/profile/after-complete', [ProfileController::class, 'status'])->name('profile.status.store');

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

    //Auto clock login
    Route::get('/auto-clock/login-clockin/{token}', [AutoClockController::class, 'loginClockIn'])->name('auto-clock.login-clockin');
    Route::get('/auto-clock/extend-work/{token}', [AutoClockController::class, 'extendWorkEmail'])->name('auto-clock.extend-work-email');
    Route::get('/auto-clock/after-login', [AutoClockController::class, 'handleAfterLogin'])->name('auto-clock.after-login');

    // Group Messages
    Route::post('/groups/{group}/messages', [GroupMessageController::class, 'store']);

    Route::get('/groups/{group}/messages', function (Group $group) {
        $user = auth()->user();

        $isAllowed =
            $group->users()->where('users.id', $user->id)->exists()
            || ($group->business && $group->business->user_id === $user->id)
            || $user->hasRole('Owner');

        abort_unless($isAllowed, 403);

        return $group->messages()
            ->with('user:id,name')
            ->orderBy('created_at')
            ->get();
    });

    // Languages
    Route::post('/languages/{language}/sync', [LanguageController::class, 'start'])->name('languages.sync')->middleware('permission:languages.access');
    Route::resource('languages', LanguageController::class)->middleware('permission:languages.access');
    Route::post('/languages/change', [LanguageController::class, 'switch'])->name('language.change');
    Route::get('languages/{language}/translations', [TranslationController::class, 'index'])->name('translations.index')->middleware('permission:languages.access');
    Route::get('languages/{language}/translations/{original}/edit', [TranslationController::class, 'edit'])->name('translations.edit')->middleware('permission:languages.access');
    Route::put('languages/{language}/translations/{original}', [TranslationController::class, 'update'])->name('translations.update')->middleware('permission:languages.access');
    Route::get('/languages/{language}/progress', [LanguageController::class, 'progress'])->name('languages.progress');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
