<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCantAccessBusinessComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $profile = $user->profile;

        // If no profile yet, let other middleware handle it
        if (! $profile || empty($profile->unique_id)) {
            return $next($request);
        }

        // Block if user answered "no" on after-complete
        if (! (bool) $profile->status) {
            return redirect()->route('dashboard');
        }

        // Block if user already owns a business
        if ($user->ownedBusiness()->exists()) {
            return redirect()->route('dashboard');
        }

        // Otherwise, allow access
        return $next($request);
    }
}
