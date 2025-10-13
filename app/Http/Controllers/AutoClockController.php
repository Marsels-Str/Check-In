<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\User;
use App\Models\TimeLog;
use Illuminate\Http\Request;
use App\Models\AutoClockToken;
use App\Models\AutoClockSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AutoClockController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $settings = AutoClockSetting::firstOrCreate(['user_id' => $user->id]);

        return Inertia::render('settings/auto-clock', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

    $validated = $request->validate([
        'work_start'   => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
        'work_end'     => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:work_start'],
        'lunch_start'  => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:work_start', 'before:work_end'],
        'lunch_end'    => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:lunch_start', 'before:work_end'],
    ]);

        AutoClockSetting::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'success' => true,
            'message' => 'Auto Clock settings updated successfully!',
        ]);
    }

    public function extendWork(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'extended_minutes' => 'required|integer|min:1|max:720',
        ]);

        $settings = AutoClockSetting::firstOrCreate(['user_id' => $user->id]);
        $settings->update($validated);

        return back();
    }

    public function loginClockIn($token)
    {
        Session::put('auto_clock_action', [
            'type' => 'clock_in',
            'token' => $token,
        ]);

        if (Auth::check()) {
            return $this->performClockIn(Auth::user());
        }

        return redirect()->route('login');
    }

    public function extendWorkEmail($token)
    {
        Session::put('auto_clock_action', [
            'type' => 'extend',
            'token' => $token,
        ]);

        if (Auth::check()) {
            return redirect()->route('settings.auto-clock');
        }

        return redirect()->route('login');
    }

    public function handleAfterLogin()
    {
        $action = Session::pull('auto_clock_action');
        if (! $action) {
            return redirect()->route('dashboard');
        }

        if ($action['type'] === 'clock_in') {
            return $this->performClockIn(Auth::user());
        }

        if ($action['type'] === 'extend') {
            return redirect()->route('settings.auto-clock');
        }

        return redirect()->route('dashboard');
    }

    private function performClockIn($user)
    {
        $existing = TimeLog::where('user_id', $user->id)
            ->whereNull('clock_out')
            ->first();

        if ($existing) {
            return redirect()->route('users.employees.index');
        }

        $business = $user->businesses()->first();

        if (! $business) {
            return redirect()->route('users.employees.index');
        }

        TimeLog::create([
            'user_id' => $user->id,
            'business_id' => $business->id,
            'clock_in' => Carbon::now('Europe/Riga'),
        ]);

        return redirect()->route('users.employees.index');
    }
}
