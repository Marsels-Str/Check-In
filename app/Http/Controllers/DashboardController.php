<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Dashboard\WorkedHoursService;
use App\Dashboard\MessageReminderService;
use App\Dashboard\EmployeeActivityService;
use App\Dashboard\DashboardOverviewService;

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
            'activity' => EmployeeActivityService::make($request),
            'overview' => DashboardOverviewService::make($request),
            'messageReminders' => MessageReminderService::make($request),
            'businesses'         => $businesses,
            'selectedBusinessId' => $request->input('business_id'),
        ]);
    }
}
