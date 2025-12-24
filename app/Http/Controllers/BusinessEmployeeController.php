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
        $businesses = collect();
        $selectedBusinessId = null;

        $withRelations = [
            'timeLogs' => fn($q) => $q->whereNull('clock_out')->orderByDesc('clock_in')->take(1),
        ];

        if ($authUser->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
            $selectedBusinessId = $request->query('business_id');

            $employees = $selectedBusinessId
                ? Business::find($selectedBusinessId)?->employees()->with($withRelations)->get()
                : collect();
        } elseif ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            $business = $authUser->ownedBusiness;
            $businesses = collect([$business]);
            $selectedBusinessId = $business->id;

            $employees = $business->employees()->with($withRelations)->get();
        } elseif ($authUser->can('employees.view')) {
            $business = $authUser->businesses()->first();
            $selectedBusinessId = $business?->id;

            if ($business) {
                $employees = $business->employees()->with($withRelations)->get();

                if (!$employees->contains($authUser->id)) {
                    $employees->push($authUser->loadMissing($withRelations));
                }
            }
        }

        return Inertia::render('users/employees/index', [
            'employees' => $employees,
            'currentUser' => $authUser,
            'businesses' => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function search(Request $request)
    {
        $request->validate([
            'unique_id' => 'required|numeric',
        ]);

        $searchResult = User::whereHas('profile', fn($q) => $q->where('unique_id', $request->unique_id))
            ->with('profile')
            ->first();

        return back()->with('searchResult', $searchResult);
    }

    public function clockIn(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return back()->with('error', 'You do not have permission to clock in this user!');
        }

        if (TimeLog::where('user_id', $user->id)->whereNull('clock_out')->exists()) {
            return back()->with('error', 'You are already clocked in!');
        }

        $business = $user->businesses()->first();

        TimeLog::create([
            'user_id' => $user->id,
            'business_id' => $business?->id,
            'clock_in' => now(),
        ]);

        return back()->with('success', 'You clocked in successfully!');
    }

    public function clockOut(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return back()->with('error', 'You do not have permission to clock out this user!');
        }

        $existing = TimeLog::where('user_id', $user->id)->whereNull('clock_out')->first();

        if (!$existing) {
            return back()->with('error', 'You are not clocked in!');
        }

        $existing->update([
            'clock_out' => now(),
        ]);

        return back()->with('success', 'You clocked out successfully!');
    }

    private function canManage(User $authUser, User $targetUser): bool
    {
        if ($authUser->hasRole('Owner')) return true;

        if ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            return $targetUser->businesses()->where('business_id', $authUser->ownedBusiness->id)->exists();
        }

        return $authUser->id === $targetUser->id && $authUser->can('employees.clockIn') && $authUser->can('employees.clockOut');
    }

    public function store(Request $request)
    {
        $authUser = $request->user();

        if (! $authUser->hasRole('Owner') && ! $authUser->hasRole('Business')) {
            return back()->with('error', 'You do not have permission to add employees!');
        }

        $rules = ['user_id' => 'required|exists:users,id'];
        if ($authUser->hasRole('Owner')) {
            $rules['business_id'] = 'required|exists:businesses,id';
        }

        $validated = $request->validate($rules);

        $business = $authUser->hasRole('Owner')
            ? Business::findOrFail($validated['business_id'])
            : $authUser->ownedBusiness;

        $user = User::with('profile', 'businesses')->findOrFail($validated['user_id']);

        if ($user->hasRole('Owner') || $user->hasRole('Business')) {
            return back()->with('error', 'This user cannot be added as an employee!');
        }

        $existingBusiness = $user->businesses()->first();
        if ($existingBusiness && $existingBusiness->id !== $business->id) {
            return back()->with('error', 'This user already belongs to a different business!');
        }

        if ($business->employees()->where('users.id', $user->id)->exists()) {
            return back()->with('error', 'This user is already an employee of this business!');
        }

        $business->employees()->attach($user->id);
        $business->update(['employees' => $business->employees()->count()]);

        $user->load('profile', 'timeLogs');

        return back()->with('success', 'Employee added successfully!');
    }

    public function remove(Request $request, User $user)
    {
        $authUser = $request->user();

        if (! $authUser->hasRole('Owner') && ! $authUser->hasRole('Business')) {
            return back()->with('error', 'You do not have permission to remove employees!');
        }

        $businesses = $authUser->hasRole('Owner')
            ? $user->businesses
            : collect([$authUser->ownedBusiness]);

        foreach ($businesses as $business) {
            if (! $business) continue;

            $activeLog = TimeLog::where('user_id', $user->id)
                ->where('business_id', $business->id)
                ->whereNull('clock_out')
                ->first();

            if ($activeLog) {
                $activeLog->update([
                    'clock_out' => now(),
                ]);
            }

            $business->employees()->detach($user->id);
            $user->groups()->where('business_id', $business->id)->detach();
            $business->update(['employees' => $business->employees()->count()]);
        }

        return back()->with('success', 'Employee removed successfully!');
    }
}
