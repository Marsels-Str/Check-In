<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use App\Models\Business;
use Illuminate\Http\Request;

class BusinessEmployeeController extends Controller
{
    /**
     * Show all employees.
     */
    public function index(Request $request)
    {
        $authUser = $request->user()->load('roles');

        $employees          = collect();
        $businesses         = [];
        $selectedBusinessId = null;

        if ($authUser->hasRole('Owner')) {
            $selectedBusinessId = $request->query('business_id');
            $businesses = Business::select('id', 'name')->orderBy('name')->get();

            if ($selectedBusinessId) {
                $employees = User::with('roles', 'business')
                    ->where('business_id', $selectedBusinessId)
                    ->get();
            }
        } elseif ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            $selectedBusinessId = $authUser->ownedBusiness->id;
            $employees = $authUser->ownedBusiness
                ->employees()
                ->with('roles')
                ->get();
        } elseif ($authUser->hasRole('Worker') && $authUser->business) {
            $selectedBusinessId = $authUser->business_id;
            $employees = $authUser->business
                ->employees()
                ->with('roles')
                ->get();
        }

        return Inertia::render('users/employees/index', [
            'employees'          => $employees,
            'currentUser'        => $authUser,
            'businesses'         => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    /**
     * Search user by unique_id from profile.
     */
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

    /**
     * Add employee to a business.
     */
    public function store(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser->hasRole('Owner') && !$authUser->hasRole('Business')) {
            return response()->json(['error' => 'You do not have permission to add employees.'], 403);
        }

        $rules = ['user_id' => 'required|exists:users,id'];
        if ($authUser->hasRole('Owner')) {
            $rules['business_id'] = 'required|exists:businesses,id';
        }
        $validated = $request->validate($rules);

        $business = $authUser->hasRole('Owner')
            ? Business::findOrFail($validated['business_id'])
            : $authUser->ownedBusiness;

        if (!$business) {
            return response()->json(['error' => 'No business found.'], 404);
        }

        $user = User::with('profile', 'roles')->findOrFail($validated['user_id']);

        if ($user->hasRole('Business')) {
            return response()->json(['error' => 'Business owners cannot be added as employees.'], 422);
        }

        if ($user->id === $authUser->id) {
            return response()->json(['error' => 'You cannot add yourself as an employee.'], 422);
        }
        if ($user->profile && $user->profile->unique_id == env('APP_OWNER_UNIQUE_ID')) {
            return response()->json(['error' => 'You cannot add the AppOwner as an employee.'], 422);
        }
        if ($user->business_id && $user->business_id !== $business->id) {
            return response()->json(['error' => 'This user already belongs to another business.'], 422);
        }
        if ($business->employees()->where('id', $user->id)->exists()) {
            return response()->json(['error' => 'This user is already an employee.'], 422);
        }

        $user->update(['business_id' => $business->id]);
        $business->update(['employees' => $business->employees()->count()]);

        return response()->json(['success' => true]);
    }

    /**
     * Remove employee from a business.
     */
    public function remove(Request $request, User $user)
    {
        $authUser = $request->user();

        if ($authUser->hasRole('Owner')) {
            $oldBusiness = $user->business;

            $user->update(['business_id' => null]);

            if ($oldBusiness) {
                $user->jobGroups()->where('business_id', $oldBusiness->id)->detach();
                $oldBusiness->update(['employees' => $oldBusiness->employees()->count()]);
            }

            return response()->json(['success' => true]);
        }

        if ($authUser->hasRole('Business')) {
            $business = $authUser->ownedBusiness;

            if (! $business) {
                return response()->json(['error' => 'No business found.'], 404);
            }

            if ($user->business_id !== $business->id) {
                return response()->json(['error' => 'This user is not an employee of your business.'], 422);
            }

            $user->update(['business_id' => null]);
            $user->jobGroups()->where('business_id', $business->id)->detach();
            $business->update(['employees' => $business->employees()->count()]);

            return response()->json(['success' => true]);
        }

        return response()->json(['error' => 'You do not have permission to remove employees.'], 403);
    }
}
