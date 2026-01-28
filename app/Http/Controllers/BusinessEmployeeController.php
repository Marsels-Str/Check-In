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

        if (!$searchResult) {
            return redirect()->route('employees.index')->with('error', t('employees.error.nothing'));
        }

        return back()->with('searchResult', $searchResult);
    }

    public function clockIn(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return back()->with('error', t('employees.error.auth.in'));
        }

        if (TimeLog::where('user_id', $user->id)->whereNull('clock_out')->exists()) {
            return back()->with('error', t('employees.error.in'));
        }

        $business = $user->businesses()->first();

        TimeLog::create([
            'user_id' => $user->id,
            'business_id' => $business?->id,
            'clock_in' => now(),
        ]);

        return back()->with('success', t('employees.success.in'));
    }

    public function clockOut(Request $request, User $user)
    {
        $authUser = $request->user();

        if (!$this->canManage($authUser, $user)) {
            return back()->with('error', t('employees.error.auth.out'));
        }

        $existing = TimeLog::where('user_id', $user->id)->whereNull('clock_out')->first();

        if (!$existing) {
            return back()->with('error', t('employees.error.out'));
        }

        $existing->update([
            'clock_out' => now(),
        ]);

        return back()->with('success', t('employees.success.out'));
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
            return back()->with('error', t('employees.error.auth.add'));
        }

        $rules = ['user_id' => 'required|exists:users,id'];
        if ($authUser->hasRole('Owner')) {
            $rules['business_id'] = 'required|exists:businesses,id';
        }

        if ($request->user()->hasRole('Owner') && ! $request->filled('business_id')) {
            return redirect()->route('employees.index')->with('error', t('employees.error.missing'));
        }

        $validated = $request->validate($rules);

        $business = $authUser->hasRole('Owner')
            ? Business::findOrFail($validated['business_id'])
            : $authUser->ownedBusiness;

        $user = User::with('profile', 'businesses')->findOrFail($validated['user_id']);

        if ($user->hasRole('Owner') || $user->hasRole('Business')) {
            return back()->with('error', t('employees.error.add'));
        }

        $existingBusiness = $user->businesses()->first();
        if ($existingBusiness && $existingBusiness->id !== $business->id) {
            return back()->with('error', t('employees.error.different'));
        }

        if ($business->employees()->where('users.id', $user->id)->exists()) {
            return back()->with('error', t('employees.error.belongs'));
        }

        $business->employees()->attach($user->id);
        $business->update(['employees' => $business->employees()->count()]);

        $user->load('profile', 'timeLogs');

        return back()->with('success', t('employees.success.add'));
    }

    public function remove(Request $request, User $user)
    {
        $authUser = $request->user();

        if (! $authUser->hasRole('Owner') && ! $authUser->hasRole('Business')) {
            return back()->with('error', t('employees.error.auth.remove'));
        }

        $businesses = $authUser->hasRole('Owner')
            ? $user->businesses
            : collect([$authUser->ownedBusiness]);

        foreach ($businesses as $business) {
            if (! $business) {
                continue;
            }

            TimeLog::where('user_id', $user->id)
                ->where('business_id', $business->id)
                ->delete();

            $business->employees()->detach($user->id);

            $user->groups()
                ->where('business_id', $business->id)
                ->detach();

            $business->update([
                'employees' => $business->employees()->count(),
            ]);
        }

        return back()->with('success', t('employees.success.remove'));
    }
}
