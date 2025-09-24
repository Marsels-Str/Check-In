<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureProfileIsCompleted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        // Allow guests or if we're already on the onboarding routes
        if (!$user || $request->routeIs('profile.complete', 'profile.complete.store', 'logout')) {
            return $next($request);
        }

        // Consider "complete" = profile exists AND has the random numeric unique_id
        $profile = $user->profile;
        $isComplete = $profile && !empty($profile->unique_id);

        if (!$isComplete) {
            return redirect()->route('profile.complete');
        }

        return $next($request);
    }
}
