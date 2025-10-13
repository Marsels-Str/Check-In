<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureCantAccessAfterComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Allow access only if session flag is present
        if (!session('can_access_after_complete')) {
            return redirect()->route('dashboard');
        }

        // Once accessed, remove the flag to prevent returning
        session()->forget('can_access_after_complete');

        return $next($request);
    }
}
