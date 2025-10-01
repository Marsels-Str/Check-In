<?php

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class BusinessProfileController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('Owner')) {
            $businesses = Business::select(
                'id',
                'name',
                'email',
                'phone',
                'country',
                'city',
                'street_address',
                'industry',
                'description'
            )->orderBy('name')->get();

            $selectedBusinessId = $request->query('business_id') ?? $businesses->first()?->id;
            $business = $selectedBusinessId
                ? $businesses->firstWhere('id', $selectedBusinessId)
                : null;
        } elseif ($user->hasRole('Business')) {
            $businesses = collect([$user->ownedBusiness])->filter();
            $selectedBusinessId = $user->ownedBusiness?->id;
            $business = $user->ownedBusiness;
        } else {
            $businesses = collect();
            $business = null;
            $selectedBusinessId = null;
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail'    => false,
            'status'             => $request->session()->get('status'),
            'auth'               => ['user' => $user->load('profile', 'business')],
            'business'           => $business,
            'businesses'         => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'industry'       => 'nullable|string|max:100',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:20',
            'country'        => 'required|string|max:50',
            'city'           => 'required|string|max:50',
            'street_address' => 'nullable|string|max:255',
            'logo'           => 'nullable|image|max:2048',
            'description'    => 'nullable|string|max:1000',
            'employees'      => 'nullable|integer|min:0',
        ]);

        $business = Business::create([
            'user_id'        => $request->user()->id,
            'name'           => $validated['name'],
            'industry'       => $validated['industry'] ?? null,
            'email'          => $validated['email'],
            'phone'          => $validated['phone'] ?? null,
            'country'        => $validated['country'],
            'city'           => $validated['city'],
            'street_address' => $validated['street_address'] ?? null,
            'description'    => $validated['description'] ?? null,
            'employees'      => $validated['employees'] ?? 0,
        ]);

        $user = $request->user();
        $user->syncRoles(['Business']);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $base64 = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
            $business->update(['logo' => $base64]);
        }

        return redirect()->route('dashboard');
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'industry'       => 'nullable|string|max:100',
            'email'          => 'required|email|max:255',
            'phone'          => 'nullable|string|max:20',
            'country'        => 'required|string|max:50',
            'city'           => 'required|string|max:50',
            'street_address' => 'nullable|string|max:255',
            'logo'           => 'nullable|image|max:2048',
            'description'    => 'nullable|string|max:1000',
            'employees'      => 'nullable|integer|min:0',
        ]);

        $user = $request->user();

        if ($user->hasRole('Business')) {
            $business = $user->ownedBusiness;
        } elseif ($user->hasRole('Owner')) {
            $businessId = $request->input('business_id');
            $business = Business::find($businessId);
        } else {
            return back()->with('error', 'You are not allowed to update this business.');
        }

        if (! $business) {
            return back()->with('error', 'No business found.');
        }

        $business->update($validated);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $base64 = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
            $business->update(['logo' => $base64]);
        }

        return back()->with('success', 'Business profile updated.');
    }

    public function removeLogo(Request $request): RedirectResponse
    {
        $business = $request->user()->business;

        if ($business && $business->logo) {
            $business->update(['logo' => null]);
        }

        return back()->with('status', 'logo-removed');
    }
}
