<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCantAccessAfterComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $profile = $user->profile;

        if (! $profile || empty($profile->unique_id)) {
            return $next($request);
        }

        if (is_null($profile->status)) {
            if ($request->routeIs('profile.afterComplete', 'profile.status.store')) {
                return $next($request);
            }
            return redirect()->route('profile.afterComplete');
        }

        if ($request->routeIs('profile.afterComplete', 'profile.status.store')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
