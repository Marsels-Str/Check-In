<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;


class ProfileController extends Controller
{
    public function completeForm()
    {
        return Inertia::render('complete-profile');
    }

    public function storeCompleteForm(Request $request)
{
    // Normalize decimals before validation
    $request->merge([
        'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
        'height' => $request->height ? str_replace(',', '.', $request->height) : null,
    ]);

    $validated = $request->validate([
        'age' => 'required|integer|min:1|max:120',
        'height' => 'required|numeric|min:1',
        'weight' => 'required|numeric|min:1',
        'phone' => 'required|string|max:15',
        'personal_code' => [
            'required',
            'string',
            'regex:/^\d{6}-\d{5}$/',
            'unique:user_profiles,personal_code',
        ],
        'country' => 'required|string|max:50',
        'city' => 'required|string|max:50',
        'portrait' => 'nullable|image|max:2048',
    ]);

    $profile = $request->user()->profile()->create($validated);

    if ($request->hasFile('portrait')) {
        $file = $request->file('portrait');
        $base64Image = 'data:image/'.$file->extension().';base64,'.base64_encode(file_get_contents($file));
        $profile->update(['portrait' => $base64Image]);
    }

    return redirect()->route('dashboard');
}

    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        // 1. Validate user fields
        $validatedUser = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $request->user()->id,
        ]);

        // 2. Normalize decimals
        $request->merge([
            'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
            'height' => $request->height ? str_replace(',', '.', $request->height) : null,
        ]);

        // 3. Validate profile fields
        $validatedProfile = $request->validate([
            'age' => 'required|integer|min:1|max:120',
            'height' => 'required|numeric|min:0',
            'weight' => 'required|numeric|min:0',
            'phone' => 'required|string|min:8|max:15',
            'personal_code' => 'required|string|max:255|unique:user_profiles,personal_code,' . optional($request->user()->profile)->id,
            'country' => 'required|string|max:50',
            'city' => 'required|string|max:50',
            'portrait' => 'nullable|image|max:2048',
        ]);

        // 4. Update users table
        $user = $request->user();
        $user->update($validatedUser);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
            $user->save();
        }

        // 5. Update or create profile
        $profile = $user->profile ?? $user->profile()->create();
        $profile->update($validatedProfile);

        // 6. Handle portrait base64
        if ($request->hasFile('portrait')) {
            $file = $request->file('portrait');
            $base64Image = 'data:image/'.$file->extension().';base64,'.base64_encode(file_get_contents($file));
            $profile->update(['portrait' => $base64Image]);
        }

        return back()->with('status', 'profile-updated');
    }

    public function updatePortrait(Request $request): RedirectResponse
{
    $request->validate([
        'portrait' => 'required|image|max:2048',
    ]);

    $profile = $request->user()->profile;

    if ($profile->portrait) {
        // just overwrite it, since it's stored as base64 in DB
        $profile->portrait = null;
    }

    if ($request->hasFile('portrait')) {
        $file = $request->file('portrait');
        $base64Image = 'data:' . $file->getMimeType() . ';base64,' . base64_encode(file_get_contents($file->getRealPath()));
        $profile->portrait = $base64Image;
    }

    $profile->save();

    return back()->with('status', 'portrait-updated');
}


    /**
     * Delete the user's account.
     */
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
