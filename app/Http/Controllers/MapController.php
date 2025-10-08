<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();
        $profile  = $authUser->profile;

        $maps = collect();
        $businesses = collect();
        $selectedBusinessId = null;

        if ($authUser->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
            $selectedBusinessId = $request->get('business_id') ?? $businesses->first()?->id;

            $maps = Map::with('business')
                ->when($selectedBusinessId, fn($q) => $q->where('business_id', $selectedBusinessId))
                ->get();

        } elseif ($authUser->hasRole('Business') && $authUser->ownedBusiness) {
            $business = $authUser->ownedBusiness;
            $businesses = collect([$business]);
            $selectedBusinessId = $business?->id;

            $maps = $business
                ? $business->maps()->with('business')->get()
                : collect();

        }

        return Inertia::render('maps/index', [
            'maps'               => $maps,
            'profile'            => $profile,
            'businesses'         => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }
    
    public function create()
    {
        return Inertia::render('maps/create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validation = [
            'name'    => 'nullable|string|max:150',
            'lat'     => 'nullable|numeric|between:-90,90',
            'lng'     => 'nullable|numeric|between:-180,180',
            'radius'  => 'nullable|numeric',
            'polygon' => 'nullable',
            'type'    => 'required|string|in:marker,circle,polygon',
        ];

        $messages = [
            'lat.between' => 'The latitude must be between -90 and 90 degrees.',
            'lng.between' => 'The longitude must be between -180 and 180 degrees.',
        ];

        if ($user->hasRole('Owner')) {
            $validation['business_id'] = 'required|exists:businesses,id';
        }

        $data = $request->validate($validation);

        if ($user->hasRole('Owner')) {
        } elseif ($user->hasRole('Business') && $user->ownedBusiness) {
            $data['business_id'] = $user->ownedBusiness->id;
        } elseif ($user->hasRole('Worker')) {
            $data['business_id'] = $user->businesses()->pluck('businesses.id')->first();
        }

        if (empty($data['business_id'])) {
            return back()->with('error', 'No business resolved for this action.');
        }

        if (isset($data['polygon']) && is_array($data['polygon'])) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        Map::create($data);

        return redirect()->route('maps.index');
    }

    public function show(string $id)
    {
        $map = Map::with('business')->findOrFail($id);

        return Inertia::render('maps/show', [
            'map' => $map,
        ]);
    }

    public function edit(string $id)
    {
        $map = Map::findOrFail($id);

        return Inertia::render('maps/edit', [
            'map' => $map,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $map = Map::findOrFail($id);

        $data = $request->validate([
            'name'         => 'nullable|string|max:255',
            'lat'          => 'nullable|numeric',
            'lng'          => 'nullable|numeric',
            'radius'       => 'nullable|numeric',
            'polygon'      => 'nullable',
            'type'         => 'required|string|in:marker,circle,polygon',
            'job_group_id' => 'nullable|exists:job_groups,id',
        ]);

        if (! empty($data['polygon']) && ! is_string($data['polygon'])) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        $map->update($data);

        return redirect()->route('maps.index')->with('success', 'Map updated successfully.');
    }

    public function destroy(string $id)
    {
        Map::destroy($id);

        return redirect()->route('maps.index')->with('success', 'Map deleted.');
    }
}
