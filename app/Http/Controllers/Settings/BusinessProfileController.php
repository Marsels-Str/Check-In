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
    public function create(): Response
    {
        return Inertia::render('complete-profiles/business');
    }

    public function edit(Request $request): Response
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
                'description',
                'logo'
            )->orderBy('name')->get();

            $selectedBusinessId = $request->query('business_id') ?? $businesses->first()?->id;
            $business = $businesses->firstWhere('id', $selectedBusinessId);
        } else {
            $business = $user->ownedBusiness;
            $businesses = collect([$business])->filter();
            $selectedBusinessId = $business?->id;
        }

        return Inertia::render('settings/business', [
            'status'             => $request->session()->get('status'),
            'auth'               => ['user' => $user->load('profile')],
            'business'           => $business,
            'businesses'         => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
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
            return back();
        }

        if (! $business) {
            return back();
        }

        $business->update($validated);

        if ($request->hasFile('logo')) {
            $this->handleLogoUpload($business, $request->file('logo'));
        }

        return back();
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:50',
            'industry'       => 'required|string|max:100',
            'email'          => 'required|email|max:150',
            'phone'          => [
                'required',
                'string',
                'min:8',
                'max:15',
                'unique:businesses,phone',
            ],
            'country'        => 'required|string|max:50',
            'city'           => 'required|string|max:50',
            'street_address' => 'required|string|max:100',
            'logo'           => 'nullable|image|max:2048',
            'description'    => 'nullable|string|max:1000',
            'employees'      => 'nullable|integer|min:0',
        ]);

        $business = Business::create([
            'user_id'        => $request->user()->id,
            ...$validated,
        ]);

        $user = $request->user();
        $user->syncRoles(['Business']);

        if ($request->hasFile('logo')) {
            $this->handleLogoUpload($business, $request->file('logo'));
        }

        return redirect()->route('dashboard');
    }

    public function updateLogo(Request $request): RedirectResponse
    {
        $request->validate(['logo' => 'required|image|max:2048']);

        $user = $request->user();
        $business = $user->ownedBusiness ?? $user->businesses()->first();

        if (! $business) {
            return back()->with('error', 'No business found to update.');
        }

        $this->handleLogoUpload($business, $request->file('logo'));

        return back();
    }

    public function removeLogo(Request $request): RedirectResponse
    {
        $user = $request->user();
        $business = $user->ownedBusiness ?? $user->businesses()->first();

        if ($business && $business->logo) {
            $business->update(['logo' => null]);
        }

        return back();
    }

    private function handleLogoUpload(Business $business, $file): void
    {
        $base64 = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
        $business->update(['logo' => $base64]);
    }
}
