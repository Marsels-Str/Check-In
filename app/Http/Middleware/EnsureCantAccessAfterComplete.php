<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCantAccessAfterComplete
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->routeIs('profile.afterComplete')) {
            if (!session('can_access_after_complete')) {
                return redirect()->route('dashboard');
            }

            session()->forget('can_access_after_complete');

            return $next($request);
        }

        return $next($request);
    }
}
