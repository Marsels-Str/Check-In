<?php

use Inertia\Inertia;
use App\Models\Languages;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AutoClockController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\PasswordController;


Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile/{user?}', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    //Auto Clock
    Route::get('/settings/auto-clock', [AutoClockController::class, 'index'])->name('auto-clock.edit');
    Route::put('/settings/auto-clock', [AutoClockController::class, 'update'])->name('auto-clock.update');
    Route::post('/settings/auto-clock/extend', [AutoClockController::class, 'extendWork'])->name('auto-clock.extend');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');

    Route::get('settings/language', function () {
        return Inertia::render('settings/language', [
            'languages' => Languages::select('id', 'name', 'code')
                ->orderBy('name')
                ->get(),

            'language' => session(
                'language',
                request()->cookie('lang', app()->getLocale())
            ),
        ]);
    })->name('language');
});
