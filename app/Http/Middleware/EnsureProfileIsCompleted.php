<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureProfileIsCompleted
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user || $request->routeIs('profile.complete', 'profile.complete.store', 'logout')) {
            return $next($request);
        }

        $profile = $user->profile;
        $isComplete = $profile && !empty($profile->unique_id);

        if (!$isComplete) {
            return redirect()->route('profile.complete');
        }

        return $next($request);
    }
}
