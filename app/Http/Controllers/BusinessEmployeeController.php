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
            'roles',
            'timeLogs' => fn($q) => $q->whereNull('clock_out')->latest()->take(1),
        ];

        if ($authUser->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
            $selectedBusinessId = $request->query('business_id') ?? $businesses->first()?->id;

            if ($selectedBusinessId && $business = Business::find($selectedBusinessId)) {
                $employees = $business->employees()->with($withRelations)->get();
            }
        } elseif ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            $business = $authUser->ownedBusiness;
            $businesses = collect([$business]);
            $selectedBusinessId = $business->id;
            $employees = $business->employees()->with($withRelations)->get();
        } elseif ($authUser->hasRole('Worker')) {
            $business = $authUser->businesses()->first();
            $selectedBusinessId = $business?->id;
            $employees = $business?->employees()->with($withRelations)->get() ?? collect();
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
        $request->validate(['unique_id' => 'required|numeric']);

        $user = User::whereHas('profile', fn($q) => $q->where('unique_id', $request->unique_id))
            ->with('profile')
            ->first();

        return response()->json($user);
    }

    public function clockIn(Request $request, User $user)
    {
        //Iegūst lietotāju kurš šobrīd ir pieslēdzies
        $authUser = $request->user();

        //Pārbauda kāda pašreizējam lietotājam ir loma ar palīg funkciju (canManage)
        if (!$this->canManage($authUser, $user)) {
            return response()->json(['error' => 'Unauthorized']);
        }

        //Pārbauda vai lietotājs jau ir atzīmējies sistēmā
        if (TimeLog::where('user_id', $user->id)->whereNull('clock_out')->exists()) {
            return response()->json(['error' => 'User is already clocked in']);
        }

        //Iegūst biznesu, kam lietotājs pieder
        $business = $user->businesses()->first();

        //Izveido ierakstu datubāzē ar attiecīgo lietotāja id un biznesa id, kam lietotājs pieder
        TimeLog::create([
            'user_id' => $user->id,
            'business_id' => $business?->id,
            'clock_in' => now(),
        ]);

        //Atgriež veiksmīgu paziņojumu priekš (front-end)
        return response()->json(['success' => true]);
    }

    public function clockOut(Request $request, User $user)
    {
        //Iegūst lietotāju kurš šobrīd ir pieslēdzies
        $authUser = $request->user();

        //Pārbauda kāda pašreizējam lietotājam ir loma ar palīg funkciju (canManage)
        if (!$this->canManage($authUser, $user)) {
            return response()->json(['error' => 'Unauthorized']);
        }

        //Pārbauda vai lietotājs jau ir atzīmējies sistēmā
        $existing = TimeLog::where('user_id', $user->id)->whereNull('clock_out')->first();

        //Ja ne tad atgriež kļūdas paziņojumu
        if (!$existing) {
            return response()->json(['error' => 'User is not clocked in']);
        }

        //Pārvērš datus no datubāzes par Carbon::parse(), lai veiktu aprēķināšanu
        $clockIn = Carbon::parse($existing->clock_in);
        //Izmanto esošo laiku
        $clockOut = now();

        //Aprēķina starpību starp darba sākumu un darba beigām
        $workedTime = gmdate('H:i:s', $clockIn->diffInSeconds($clockOut));

        //Atjaunina laukus tabulā
        $existing->update([
            'clock_out' => $clockOut,
            'worked_time' => $workedTime,
        ]);

        //Atgriež veiksmīgu paziņojumu priekš (front-end)
        return response()->json(['success' => true]);
    }

    private function canManage($authUser, $targetUser)
    {
        if ($authUser->hasRole('Owner')) return true;

        if ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            return $targetUser->businesses()
                ->where('business_id', $authUser->ownedBusiness->id)
                ->exists();
        }

        return $authUser->hasRole('Worker') && $authUser->id === $targetUser->id;
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

        $user = User::with('profile', 'roles', 'businesses')->findOrFail($validated['user_id']);

        if ($user->hasRole('Owner') || 
            ($user->profile && $user->profile->unique_id == env('APP_OWNER_UNIQUE_ID')) ||
            $user->id === $authUser->id ||
            $user->hasRole('Business')
        ) {
            return response()->json(['error' => 'The App Owner or Business cannot be added as an employee.']);
        }

        $existingBusiness = $user->businesses()->first();
        if ($existingBusiness && $existingBusiness->id !== $business->id) {
            return response()->json([
                'error' => "This user already belongs to another business ({$existingBusiness->name})."
            ]);
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

        if (! $authUser->hasRole('Owner') && ! $authUser->hasRole('Business')) {
            return response()->json(['error' => 'You do not have permission to remove employees.']);
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
                $clockOut = now();
                $clockIn = Carbon::parse($activeLog->clock_in);
                $workedTime = gmdate('H:i:s', $clockOut->diffInSeconds($clockIn));

                $activeLog->update([
                    'clock_out' => $clockOut,
                    'worked_time' => $workedTime,
                ]);
            }

            $business->employees()->detach($user->id);
            $user->jobGroups()->where('business_id', $business->id)->detach();
            $business->update(['employees' => $business->employees()->count()]);
        }

        return response()->json(['success' => true]);
    }
}
