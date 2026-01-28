<?php

namespace App\Http\Controllers\Settings;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class BusinessProfileController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('complete-profiles/business');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'name' => htmlspecialchars(trim($request->name)),
            'city' => htmlspecialchars(trim($request->city)),
            'country' => htmlspecialchars(trim($request->country)),
        ]);

        $validated = $request->validate([
            'name'           => 'required|string|min:1|max:50',
            'industry'       => 'required|string|min:2|max:50',
            'email'          => 'required|email|max:100|unique:businesses,email',
            'address' => 'nullable|string|max:100',
            'logo'           => 'nullable|image|max:2048',
            'description'    => 'nullable|string|max:1000',
            'employees'      => 'nullable|integer|min:0',
            'country'        => [
                'required',
                'string',
                'min:4',
                'max:60',
                'regex:/^[\p{L}\s]+$/u'
            ],
            'city'           => [
                'required',
                'string',
                'min:1',
                'max:170',
                'regex:/^[\p{L}\s]+$/u'
            ],
            'phone'          => [
                'required',
                'string',
                'min:8',
                'max:15',
                'regex:/^\+?[0-9]+$/',
                'unique:businesses,phone',
            ],
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

    public function cancel(Request $request): RedirectResponse
    {
        $user = $request->user();

        $user->syncRoles(['Unemployed']);

        return redirect()->route('dashboard');
    }

    public function edit(Request $request): Response
    {
        $user = $request->user();

        if ($user->businesses()->exists()) {
            return Inertia::render('settings/locked/business');
        }

        if (! $user->can('business.create')) {
            return Inertia::render('settings/locked/business');
        }

        if ($user->hasRole('Owner')) {
            $businesses = Business::select(
                'id',
                'name',
                'email',
                'phone',
                'country',
                'city',
                'address',
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
        $user = $request->user();
        $business = $user->ownedBusiness ?? null;

        if ($user->businesses()->exists()) {
            return Inertia::render('settings/locked/business');
        }

        if (! $user->can('business.create')) {
            return Inertia::render('settings/locked/business');
        }

        if ($user->hasRole('Owner')) {
            $businessId = $request->input('business_id');
            $business = Business::find($businessId);
        }

        if (! $business) {
            return back();
        }

        $request->merge([
            'name' => htmlspecialchars(trim($request->name)),
            'city' => htmlspecialchars(trim($request->city)),
            'country' => htmlspecialchars(trim($request->country)),
        ]);

        $validated = $request->validate([
            'name'           => 'required|string|min:1|max:50',
            'industry'       => 'required|string|min:2|max:50',
            'address' => 'nullable|string|max:100',
            'logo'           => 'nullable|image|max:2048',
            'description'    => 'nullable|string|max:1000',
            'employees'      => 'nullable|integer|min:0',
            'country'        => [
                'required',
                'string',
                'min:4',
                'max:60',
                'regex:/^[\p{L}\s]+$/u'
            ],
            'city'           => [
                'required',
                'string',
                'min:1',
                'max:170',
                'regex:/^[\p{L}\s]+$/u'
            ],
            'email'          => [
                'required',
                'email',
                'max:100',
                Rule::unique('businesses', 'email')->ignore($business->id),
            ],
            'phone'          => [
                'required',
                'string',
                'min:8',
                'max:15',
                'regex:/^\+?[0-9]+$/',
                Rule::unique('businesses', 'phone')->ignore($business->id),
            ],
        ]);

        $business->update($validated);

        if ($request->hasFile('logo')) {
            $this->handleLogoUpload($business, $request->file('logo'));
        }

        return redirect()->route('business.update', ['business_id' => $business->id])->with('success', t('settings.business.success.update'));
    }

    public function updateLogo(Request $request): RedirectResponse
    {
        $request->validate(['logo' => 'required|image|max:2048']);

        $user = $request->user();
        $business = $user->ownedBusiness ?? $user->businesses()->first();

        if (! $business) {
            return back();
        }

        $this->handleLogoUpload($business, $request->file('logo'));

        return redirect()->route('business.update')->with('success', t('settings.business.success.logo'));
    }

    public function removeLogo(Request $request): RedirectResponse
    {
        $user = $request->user();
        $business = $user->ownedBusiness ?? $user->businesses()->first();

        if ($business && $business->logo) {
            $business->update(['logo' => null]);
        }

        return redirect()->route('business.update')->with('success', t('settings.business.success.logo.remove'));
    }

    private function handleLogoUpload(Business $business, $file): void
    {
        $base64 = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
        $business->update(['logo' => $base64]);
    }
}