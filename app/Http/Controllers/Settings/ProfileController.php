<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Business;
use Inertia\Response;

class ProfileController extends Controller
{
    public function completeForm(): Response
    {
        return Inertia::render('complete-profiles/complete');
    }

    public function storeCompleteForm(Request $request): RedirectResponse
    {
        $request->merge([
            'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
            'height' => $request->height ? str_replace(',', '.', $request->height) : null,
        ]);

        $validated = $request->validate([
            'age'           => 'required|integer|min:1|max:120',
            'height'        => 'required|numeric|min:1',
            'weight'        => 'required|numeric|min:1',
            'phone'         => 'required|string|max:15',
            'personal_code' => [
                'required',
                'string',
                'regex:/^\d{6}-\d{5}$/',
                'unique:user_profiles,personal_code',
            ],
            'country'  => 'required|string|max:50',
            'city'     => 'required|string|max:50',
            'portrait' => 'nullable|image|max:2048',
        ]);

        $profile = $request->user()->profile()->create($validated);

        if ($request->hasFile('portrait')) {
            $file = $request->file('portrait');
            $profile->update([
                'portrait' => 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath())),
            ]);
        }

        return redirect()->route('profile.afterComplete');
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
                'description'
            )->orderBy('name')->get();

            $selectedBusinessId = $request->query('business_id') ?? $businesses->first()?->id;
            $business = $selectedBusinessId
                ? $businesses->firstWhere('id', $selectedBusinessId)
                : null;
        } elseif ($user->hasRole('Business')) {
            $businesses = collect([$user->ownedBusiness])->filter();
            $business = $user->ownedBusiness;
            $selectedBusinessId = $business?->id;
        } else {
            $businesses = collect();
            $business = null;
            $selectedBusinessId = null;
        }

        return Inertia::render('settings/profile', [
            'mustVerifyEmail'   => $user instanceof MustVerifyEmail,
            'status'            => $request->session()->get('status'),
            'auth'              => [
                'user' => $user->load('profile'),
            ],
            'business'          => $business,
            'businesses'        => $businesses,
            'selectedBusinessId'=> $selectedBusinessId,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validatedUser = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update($validatedUser);

        if ($user->wasChanged('email')) {
            $user->update(['email_verified_at' => null]);
        }

        $request->merge([
            'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
            'height' => $request->height ? str_replace(',', '.', $request->height) : null,
        ]);

        $validatedProfile = $request->validate([
            'age'           => 'required|integer|min:1|max:120',
            'height'        => 'required|numeric|min:0',
            'weight'        => 'required|numeric|min:0',
            'phone'         => 'required|string|min:8|max:15',
            'personal_code' => 'required|string|max:255|unique:user_profiles,personal_code,' . optional($user->profile)->id,
            'country'       => 'required|string|max:50',
            'city'          => 'required|string|max:50',
            'portrait'      => 'nullable|image|max:2048',
        ]);

        $profile = $user->profile ?? $user->profile()->create();
        $profile->update($validatedProfile);

        if ($request->hasFile('portrait')) {
            $file = $request->file('portrait');
            $profile->update([
                'portrait' => 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath())),
            ]);
        }

        return back()->with('status', 'profile-updated');
    }

    public function updatePortrait(Request $request): RedirectResponse
    {
        $request->validate([
            'portrait' => 'required|file|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('portrait')) {
            $file = $request->file('portrait');
            $request->user()->profile->update([
                'portrait' => 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath())),
            ]);
        }

        return back()->with('status', 'portrait-updated');
    }

    public function removePortrait(Request $request): RedirectResponse
    {
        if ($request->user()->profile) {
            $request->user()->profile->update(['portrait' => null]);
        }

        return back()->with('status', 'portrait-removed');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();
        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
