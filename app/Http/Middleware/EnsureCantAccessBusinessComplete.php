<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Business;

class EnsureCantAccessBusinessComplete
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $profile = $user->profile;
        $hasCompletedProfile = $profile && !empty($profile->unique_id);

        if (!$hasCompletedProfile) {
            return redirect()->route('profile.complete');
        }

        $hasBusiness = Business::where('user_id', $user->id)->exists();

        if ($hasBusiness) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
