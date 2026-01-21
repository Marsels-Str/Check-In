<?php

use App\Http\Middleware\SetLanguage;
use Illuminate\Foundation\Application;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->alias([
            'language' => \App\Http\Middleware\SetLanguage::class,
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
            'ensure.profile.complete' => \App\Http\Middleware\EnsureProfileIsCompleted::class,
            'after.complete.access' => \App\Http\Middleware\EnsureCantAccessAfterComplete::class,
            'after.business.complete.access' => \App\Http\Middleware\EnsureCantAccessBusinessComplete::class,
        ]);

        $middleware->web(append: [
            SetLanguage::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withSchedule(function ($schedule) {
        $schedule->command('auto-clock:run')->everyMinute();
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })
    ->create();
