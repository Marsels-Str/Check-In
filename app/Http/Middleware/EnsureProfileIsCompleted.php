<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureProfileIsCompleted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $profile = $user->profile;
        $isComplete = $profile && ! empty($profile->unique_id);

        if (! $isComplete) {
            if (! $request->routeIs('profile.complete', 'profile.complete.store')) {
                return redirect()->route('profile.complete');
            }

            return $next($request);
        }

        if ($request->routeIs('profile.complete', 'profile.complete.store')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
