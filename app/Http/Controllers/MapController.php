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
        $user = $request->user();
        $profile = $user->profile;

        $businesses = collect();
        $selectedBusinessId = null;
        $maps = collect();

        if ($user->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
            $selectedBusinessId = $request->integer('business_id') ?? $businesses->first()?->id;
        } elseif ($user->hasRole('Business') && $user->ownedBusiness) {
            $business = $user->ownedBusiness;
            $businesses = collect([$business]);
            $selectedBusinessId = $business->id;
        }

        $maps = $selectedBusinessId
            ? Map::with('business')->where('business_id', $selectedBusinessId)->get()
            : collect();

        return Inertia::render('maps/index', [
            'maps' => $maps,
            'profile' => $profile,
            'businesses' => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'        => 'nullable|string|max:100',
            'lat'         => 'nullable|numeric',
            'lng'         => 'nullable|numeric',
            'radius'      => 'nullable|numeric',
            'polygon'     => 'nullable',
            'type'        => 'required|string|in:marker,circle,polygon',
            'business_id' => $user->hasRole('Owner') ? 'required|exists:businesses,id' : 'nullable',
        ]);

        $data['business_id'] = $this->resolveBusinessId($user, $data['business_id'] ?? null);

        if (! $data['business_id']) {
            return back();
        }

        if (is_array($data['polygon'] ?? null)) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        Map::create($data);

        return redirect()
            ->route('maps.index', ['business_id' => $data['business_id']]);
    }

    public function show(Request $request, string $id)
    {
        $map = Map::with('business')->findOrFail($id);

        return Inertia::render('maps/show', [
            'map' => $map,
            'selectedBusinessId' => $request->get('business_id', $map->business_id),
        ]);
    }

    public function edit(Request $request, string $id)
    {
        $map = Map::findOrFail($id);

        return Inertia::render('maps/edit', [
            'map' => $map,
            'selectedBusinessId' => $request->get('business_id'), $map->business_id,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $map = Map::findOrFail($id);

        $data = $request->validate([
            'name'    => 'nullable|string|max:100',
            'lat'     => 'nullable|numeric',
            'lng'     => 'nullable|numeric',
            'radius'  => 'nullable|numeric',
            'polygon' => 'nullable',
            'type'    => 'required|string|in:marker,circle,polygon',
        ]);

        if ($data['type'] === 'polygon' && !empty($data['polygon'])) {
            $polygon = is_string($data['polygon'])
                ? json_decode($data['polygon'], true)
                : $data['polygon'];

            if (!is_array($polygon) || count($polygon) < 3) {
                return back()
                    ->withErrors(['polygon' => 'A polygon must have at least 3 points.'])
                    ->withInput();
            }

            $data['polygon'] = json_encode($polygon);
        }

        $map->update($data);

        return redirect()
            ->route('maps.index', ['business_id' => $map->business_id]);
    }

    public function destroy(string $id)
    {
        $map = Map::findOrFail($id);
        $map->delete();

        return redirect()
            ->route('maps.index', ['business_id' => $map->business_id]);
    }

    private function resolveBusinessId($user, $inputId = null): ?int
    {
        return match (true) {
            $user->hasRole('Owner')    => $inputId,
            $user->hasRole('Business') => $user->ownedBusiness?->id,
            $user->hasRole('Worker')   => $user->businesses()->value('businesses.id'),
            default                    => null,
        };
    }
}
