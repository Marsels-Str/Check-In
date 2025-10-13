<?php

namespace App\Http\Controllers\Settings;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Business;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class ProfileController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('complete-profiles/user');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
            'height' => $request->height ? str_replace(',', '.', $request->height) : null,
        ]);

        $validated = $request->validate([
            'age'           => 'required|integer|min:14|max:120',
            'height'        => 'required|integer|min:1',
            'weight'        => 'required|integer|min:1',
            'phone'         => [
                'required',
                'string',
                'min:8',
                'max:15',
                'unique:user_profiles,phone',
            ],
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

        return redirect()->route('profile.afterComplete')->with('can_access_after_complete', true);
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

    public function update(Request $request, ?User $user = null): RedirectResponse
    {
        $user = $user ?? $request->user();

        $validated = $request->validate([
            'name'          => 'sometimes|required|string|max:50',
            'email'         => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'age'           => 'nullable|integer|min:14|max:120',
            'height'        => 'nullable|numeric|min:1',
            'weight'        => 'nullable|numeric|min:1',
            'country'       => 'nullable|string|max:50',
            'city'          => 'nullable|string|max:50',
            'phone'         => [
                'nullable',
                'string',
                'min:8',
                'max:15',
                'unique:user_profiles,phone,' . optional($user->profile)->id,
            ],
            'personal_code' => [
                'nullable',
                'string',
                'regex:/^\d{6}-\d{5}$/',
                'unique:user_profiles,personal_code,' . optional($user->profile)->id,
            ],
        ]);

        if (isset($validated['name']) || isset($validated['email'])) {
            $user->update([
                'name'  => $validated['name'] ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
            ]);
        }

        $profile = $user->profile ?: $user->profile()->create([]);

        foreach ($validated as $key => $value) {
            if (in_array($key, ['age', 'height', 'weight', 'country', 'city', 'phone', 'personal_code'])) {
                $profile->{$key} = $value ?? $profile->{$key};
            }
        }

        $profile->save();

        return back()->with('status', 'profile-saved');
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

        return back();
    }

    public function removePortrait(Request $request): RedirectResponse
    {
        if ($request->user()->profile) {
            $request->user()->profile->update(['portrait' => null]);
        }

        return back();
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
