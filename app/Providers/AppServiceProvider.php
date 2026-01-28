<?php

namespace App\Providers;


use Inertia\Inertia;
use App\Models\Languages;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'flash' => fn () => [
                'success' => session('success')
                    ? ['text' => session('success'), 'id' => uniqid()]
                    : null,
                'error' => session('error')
                    ? ['text' => session('error'), 'id' => uniqid()]
                    : null,
            ],
            'searchResult' => fn () => session('searchResult'),
        ]);

        view()->composer('*', function ($view) {
            $view->with('allLanguages', Languages::all());
        });
    }
}
