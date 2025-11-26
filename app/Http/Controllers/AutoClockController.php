<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\User;
use App\Models\TimeLog;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\AutoClockToken;
use App\Models\AutoClockSetting;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class AutoClockController extends Controller
{
    public function index(Request $request)
    {
        //Iegūst lietotāju kurš šobrīd ir pieslēdzies
        $user = $request->user();

        //Izveido tukšus laukus tabulā, kad lietotājs apmeklē konkrēto lapu
        $settings = AutoClockSetting::firstOrCreate(['user_id' => $user->id]);

        //Pārbauda vai lietotājs pieder biznesam vai lietotājam pieder bizness
        $hasBusiness = $user->businesses()->exists() || $user->ownedBusiness()->exists();

        if (! $hasBusiness) {
            return Inertia::render('settings/locked/auto-clock');
        }

        //Attēlo skatu
        return Inertia::render('settings/auto-clock', [
            'settings' => $settings,
            'hasBusiness' => $hasBusiness,
        ]);
    }

    public function update(Request $request)
    {
        //Iegūst lietotāju kurš šobrīd ir pieslēdzies
        $user = $request->user();

        //Validēte ievades laukus
        $validated = $request->validate([
            'work_start'   => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'work_end'     => ['required', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:work_start'],
            'lunch_start'  => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:work_start', 'before:work_end'],
            'lunch_end'    => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:lunch_start', 'before:work_end'],
        ]);

        //Atjaunina laukus vai izveido tos
        AutoClockSetting::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        //Atgriež veiksmīgu paziņojumu priekš (front-end)
        return redirect()->back();
    }

    public function extendWork(Request $request)
    {
        //Iegūst lietotāju kurš šobrīd ir pieslēdzies
        $user = $request->user();

        //Validēte ievades lauku
        $validated = $request->validate([
            'extended_minutes' => 'required|integer|min:1|max:720',
        ]);

        //Tiek izveidots lauks, kad pirmo reizi tiek apmeklēta konkrētā lapa
        AutoClockSetting::firstOrCreate(['user_id' => $user->id])->update($validated);

        //Atrgriežas
        return redirect()->back();
    }

    public function loginClockIn(string $token)
    {
        return $this->handleMagicLink($token, expectedType: 'clockin');
    }

    public function extendWorkEmail(string $token)
    {
        return $this->handleMagicLink($token, expectedType: 'extend');
    }

    private function handleMagicLink(string $token, string $expectedType)
    {
        $record = AutoClockToken::where('token', $token)
            ->where('action_type', $expectedType)
            ->where('expires_at', '>', now())
            ->first();

        if (! $record) {
            return redirect()->route('login');
        }

        $record->update([
            'token'   => Str::random(40),
        ]);

        Session::put('auto_clock_action', ['type' => $expectedType]);

        return redirect()->route('auto-clock.after-login');
    }

    public function handleAfterLogin()
    {
        $action = Session::pull('auto_clock_action');
        if (! $action) {
            return redirect()->route('dashboard');
        }

        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $business = $user->businesses()->first();
        if (! $business) {
            return redirect()->route('dashboard');
        }

        if ($action['type'] === 'clockin') {
            return $this->performClockIn($user);
        }

        if ($action['type'] === 'extend') {
            return redirect()->route('auto-clock.edit');
        }

        return redirect()->route('dashboard');
    }

    private function performClockIn($user)
    {
        $existing = TimeLog::where('user_id', $user->id)
            ->whereNull('clock_out')
            ->first();

        if ($existing) {
            return redirect()->route('employees.index');
        }

        $business = $user->businesses()->first();
        if (! $business) {
            return redirect()->route('dashboard');
        }

        TimeLog::create([
            'user_id'     => $user->id,
            'business_id' => $business->id,
            'clock_in'    => now(),
        ]);

        return redirect()->route('employees.index');
    }
}
