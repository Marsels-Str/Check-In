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

        if (! $profile || empty($profile->unique_id)) {
            return $next($request);
        }

        if (! (bool) $profile->status) {
            return redirect()->route('dashboard');
        }

        if ($user->ownedBusiness()->exists()) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
