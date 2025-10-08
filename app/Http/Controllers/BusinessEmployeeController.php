<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\User;
use App\Models\TimeLog;
use App\Models\Business;
use Illuminate\Http\Request;

class BusinessEmployeeController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user()->load('roles');

        $employees = collect();
        $businesses = [];
        $selectedBusinessId = null;

        if ($authUser->hasRole('Owner')) {
            $selectedBusinessId = $request->query('business_id');
            $businesses = Business::select('id', 'name')->orderBy('name')->get();

            if ($selectedBusinessId) {
                $employees = Business::find($selectedBusinessId)
                    ?->employees()
                    ->with([
                        'roles',
                        'timeLogs' => fn($q) => $q->whereNull('clock_out')->latest()->take(1)
                    ])
                    ->get() ?? collect();
            }
        } elseif ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            $selectedBusinessId = $authUser->ownedBusiness->id;
            $employees = $authUser->ownedBusiness
                ->employees()
                ->with([
                    'roles',
                    'timeLogs' => fn($q) => $q->whereNull('clock_out')->latest()->take(1)
                ])
                ->get();
        } elseif ($authUser->hasRole('Worker')) {
            $business = $authUser->businesses()->first();
            $selectedBusinessId = $business?->id;
            $employees = $business
                ?->employees()
                ->with([
                    'roles',
                    'timeLogs' => fn($q) => $q->whereNull('clock_out')->latest()->take(1)
                ])
                ->get() ?? collect();
        }

        return Inertia::render('users/employees/index', [
            'employees'          => $employees,
            'currentUser'        => $authUser,
            'businesses'         => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'unique_id' => 'required|numeric',
        ]);

        $user = User::whereHas('profile', function ($q) use ($request) {
            $q->where('unique_id', $request->unique_id);
        })->with('profile')->first();

        return response()->json($user);
    }

    public function clockIn(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $existing = TimeLog::where('user_id', $user->id)
            ->whereNull('clock_out')
            ->latest()
            ->first();

        if ($existing) {
            return response()->json(['error' => 'User is already clocked in'], 422);
        }

        $business = $user->businesses()->first();

        TimeLog::create([
            'user_id' => $user->id,
            'business_id' => $business?->id,
            'clock_in' => Carbon::now(),
        ]);

        return response()->json(['success' => true]);
    }

    public function clockOut(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return response()->json(['error' => 'Unauthorized']);
        }

        $log = TimeLog::where('user_id', $user->id)
            ->whereNull('clock_out')
            ->latest()
            ->first();

        if (!$log) {
            return response()->json(['error' => 'User is not clocked in']);
        }

        $clockIn = Carbon::parse($log->clock_in, 'Europe/Riga');
        $clockOut = now('Europe/Riga');

        $diffInSeconds = $clockOut->diffInSeconds($clockIn);

        $previousSeconds = 0;
        if ($log->worked_time) {
            $timeParts = explode(':', $log->worked_time);
            $previousSeconds = ($timeParts[0] * 3600) + ($timeParts[1] * 60) + $timeParts[2];
        }

        $totalSeconds = $clockOut->diffInSeconds($clockIn);
        $workedTime = gmdate('H:i:s', $totalSeconds);

        $log->update([
            'clock_out' => $clockOut,
            'worked_time' => $workedTime,
        ]);

        return response()->json(['success' => true]);
    }

    private function canManage($authUser, $targetUser)
    {
        if ($authUser->hasRole('Owner')) {
            return true;
        }

        if ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            return $targetUser->businesses()
                ->where('business_id', $authUser->ownedBusiness->id)
                ->exists();
        }

        if ($authUser->hasRole('Worker')) {
            return $authUser->id === $targetUser->id;
        }

        return false;
    }

    public function store(Request $request)
    {
        $authUser = $request->user();

        if (! $authUser->hasRole('Owner') && ! $authUser->hasRole('Business')) {
            return response()->json(['error' => 'You do not have permission to add employees.']);
        }

        $rules = ['user_id' => 'required|exists:users,id'];
        if ($authUser->hasRole('Owner')) {
            $rules['business_id'] = 'required|exists:businesses,id';
        }

        $validated = $request->validate($rules);

        $business = $authUser->hasRole('Owner')
            ? Business::findOrFail($validated['business_id'])
            : $authUser->ownedBusiness;

        if (! $business) {
            return response()->json(['error' => 'No business found.']);
        }

        $user = User::with('profile', 'roles', 'businesses')->findOrFail($validated['user_id']);

        if ($user->hasRole('Owner') || ($user->profile && $user->profile->unique_id == env('APP_OWNER_UNIQUE_ID'))) {
            return response()->json(['error' => 'The App Owner cannot be added as an employee.']);
        }

        if ($user->id === $authUser->id) {
            return response()->json(['error' => 'You cannot add yourself as an employee.']);
        }

        if ($user->hasRole('Business')) {
            return response()->json(['error' => 'Business owners cannot be added as employees.']);
        }

        if ($user->businesses()->exists()) {
            $existingBusiness = $user->businesses()->first();
            if ($existingBusiness->id !== $business->id) {
                return response()->json([
                    'error' => "This user already belongs to another business ({$existingBusiness->name})."
                ]);
            }
        }

        if ($business->employees()->where('users.id', $user->id)->exists()) {
            return response()->json(['error' => 'This user is already an employee of this business.']);
        }

        $business->employees()->attach($user->id, ['role' => 'Worker']);
        $business->update(['employees' => $business->employees()->count()]);

        return response()->json(['success' => true]);
    }

    public function remove(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->hasRole('Owner')) {
            $businesses = $user->businesses()->get();

            foreach ($businesses as $business) {
                $business->employees()->detach($user->id);
                $user->jobGroups()->where('business_id', $business->id)->detach();
                $business->update(['employees' => $business->employees()->count()]);
            }

            return response()->json(['success' => true]);
        }

        if ($authUser->hasRole('Business')) {
            $business = $authUser->ownedBusiness;

            if (!$business) {
                return response()->json(['error' => 'No business found.'], 404);
            }

            if (!$business->employees()->where('users.id', $user->id)->exists()) {
                return response()->json(['error' => 'This user is not an employee of your business.'], 422);
            }

            $business->employees()->detach($user->id);
            $user->jobGroups()->where('business_id', $business->id)->detach();
            $business->update(['employees' => $business->employees()->count()]);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'You do not have permission to remove employees.'], 403);
    }
}
