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

        // No profile yet → allow everything (or frontend decides)
        if (! $profile || empty($profile->unique_id)) {
            return $next($request);
        }

        // 1️⃣ Not answered yet → only allow after-complete routes
        if (is_null($profile->status)) {
            if ($request->routeIs('profile.afterComplete', 'profile.status.store')) {
                return $next($request);
            }
            return redirect()->route('profile.afterComplete');
        }

        // 2️⃣ Answer exists → block after-complete routes completely
        if ($request->routeIs('profile.afterComplete', 'profile.status.store')) {
            return redirect()->route('dashboard');
        }

        // 3️⃣ Answer exists → allow everything else
        return $next($request);
    }
}
