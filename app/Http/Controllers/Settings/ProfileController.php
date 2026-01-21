<?php

namespace App\Http\Controllers\Settings;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
            'city' => htmlspecialchars(trim($request->city)),
            'country' => htmlspecialchars(trim($request->country)),
            'weight' => $request->weight ? str_replace(',', '.', $request->weight) : null,
            'height' => $request->height ? str_replace(',', '.', $request->height) : null,
        ]);

        $validated = $request->validate([
                    'age'           => 'required|integer|min:14|max:100',
                    'height'        => 'required|numeric|min:100|max:300',
                    'weight'        => 'required|numeric|min:40|max:700',
                    'country'       => [
                        'required',
                        'string',
                        'min:4',
                        'max:60',
                        'regex:/^[\p{L}\s]+$/u'
                    ],
                    'city'          => [
                        'required',
                        'string',
                        'min:1',
                        'max:170',
                        'regex:/^[\p{L}\s]+$/u'
                    ],
                    'phone'         => [
                        'required',
                        'string',
                        'min:8',
                        'max:15',
                        'regex:/^\+?[0-9]+$/',
                        'unique:user_profiles,phone',
                    ],
                    'personal_code' => [
                        'required',
                        'string',
                        'regex:/^\d{6}-\d{5}$/',
                        'unique:user_profiles,personal_code',
                    ],
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
                'address',
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

        $request->merge([
            'name'    => $request->name    ? htmlspecialchars(trim($request->name))    : null,
            'city'    => $request->city    ? htmlspecialchars(trim($request->city))    : null,
            'country' => $request->country ? htmlspecialchars(trim($request->country)) : null,
            'weight'  => $request->weight  ? str_replace(',', '.', $request->weight)  : null,
            'height'  => $request->height  ? str_replace(',', '.', $request->height)  : null,
        ]);

        $profile = $user->profile()->first();

        $validated = $request->validate([
            'email'         => ['nullable','email','max:100',"unique:users,email,{$user->id}"],
            'name'          => ['nullable','string','min:1','max:50','regex:/^[\p{L}\s]+$/u'],
            'age'           => ['required','integer','min:14','max:100'],
            'height'        => ['required','numeric','min:100','max:300'],
            'weight'        => ['required','numeric','min:40','max:700'],
            'country'       => ['required','string','min:4','max:60','regex:/^[\p{L}\s]+$/u'],
            'city'          => ['required','string','min:1','max:170','regex:/^[\p{L}\s]+$/u'],
            'phone'         => [
                'required','string','min:8','max:15','regex:/^\+?[0-9]+$/',
                Rule::unique('user_profiles','phone')->ignore($profile?->id),
            ],
            'personal_code' => [
                'required','string','regex:/^\d{6}-\d{5}$/',
                Rule::unique('user_profiles','personal_code')->ignore($profile?->id),
            ],
        ]);

        if (!empty($validated['name']) || !empty($validated['email'])) {
            $user->update([
                'name'  => $validated['name']  ?? $user->name,
                'email' => $validated['email'] ?? $user->email,
            ]);
        }

        $profile = $user->profile()->firstOrNew(['user_id' => $user->id]);
        $profile->fill([
            'age'           => $validated['age'],
            'height'        => $validated['height'],
            'weight'        => $validated['weight'],
            'country'       => $validated['country'],
            'city'          => $validated['city'],
            'phone'         => $validated['phone'],
            'personal_code' => $validated['personal_code'],
        ]);
        $profile->save();

        return redirect()->back()->with('success', 'Profile updated successfully.');
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

        return redirect()->route('profile.update')->with('success', 'Portrait updated successfully.');
    }

    public function removePortrait(Request $request): RedirectResponse
    {
        if ($request->user()->profile) {
            $request->user()->profile->update(['portrait' => null]);
        }

        return redirect()->route('profile.update')->with('success', 'Portrait removed successfully.');
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

    public function status(Request $request)
    {
        $request->validate([
            'status' => 'required|boolean',
        ]);

        $user = $request->user();
        $profile = $user->profile;

        $profile->status = $request->boolean('status');
        $profile->save();

        if ($profile->status === true && ! $user->business()->exists()) {
            return redirect()->route('business.complete');
        }

        return redirect()->route('dashboard');
    }
}
