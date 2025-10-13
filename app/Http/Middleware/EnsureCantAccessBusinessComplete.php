<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCantAccessBusinessComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only allow access if the session key exists
        if (! session('can_access_business_complete')) {
            return redirect()->route('dashboard');
        }

        // Once accessed, remove the key to prevent revisiting
        session()->forget('can_access_business_complete');

        return $next($request);
    }
}
