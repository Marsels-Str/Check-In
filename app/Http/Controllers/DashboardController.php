<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Dashboard\WorkedHoursService;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = $request->user();
        
        $businesses = $user->hasRole('Owner')
            ? Business::select('id', 'name')->orderBy('name')->get()
            : collect();
        
        return Inertia::render('dashboard', [
            'workedHours' => WorkedHoursService::make($request),
            'businesses'         => $businesses,
            'selectedBusinessId' => $request->input('business_id'),
        ]);
    }
}
