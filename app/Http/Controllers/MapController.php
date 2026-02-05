<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Inertia\Inertia;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Http\Exceptions\HttpResponseException;

class MapController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $businesses = collect();
        $selectedBusinessId = null;

        if ($user->hasRole('Owner')) {
            $businesses = Business::select('id', 'name')->orderBy('name')->get();
            $selectedBusinessId = $request->integer('business_id') ?? $businesses->first()?->id;
        } elseif ($user->can('maps.view')) {
            $business = $user->ownedBusiness ?? $user->businesses()->first();
            if ($business) {
                $businesses = collect([$business]);
                $selectedBusinessId = $business->id;
            }
        }

        $maps = $selectedBusinessId
            ? Map::with('business')->where('business_id', $selectedBusinessId)->get()
            : collect();

        return Inertia::render('maps/index', [
            'maps' => $maps,
            'businesses' => $businesses,
            'selectedBusinessId' => $selectedBusinessId,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user->can('maps.create')) {
            return back();
        }

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

        if (!$data['business_id']) {
            return back()->with('error', 'Unable to resolve business for this map.');
        }

        if (is_array($data['polygon'] ?? null)) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        Map::create($data);

        return redirect()->route('maps.index', ['business_id' => $data['business_id']])->with('success', t('maps.success.create'));
    }

    public function show(Map $map)
    {
        $this->authorizeMapAccess($map, 'maps.view');

        return Inertia::render('maps/show', [
            'map' => $map->load('business'),
            'selectedBusinessId' => $map->business_id,
        ]);
    }

    public function update(Request $request, Map $map)
    {
        $this->authorizeMapAccess($map, 'maps.update');

        $data = $request->validate([
            'name' => 'required|string|max:100',

            'type' => 'required|string|in:marker,circle,polygon',

            'lat' => 'required_if:type,marker,circle|nullable|numeric',
            'lng' => 'required_if:type,marker,circle|nullable|numeric',

            'radius' => 'required_if:type,circle|nullable|numeric|min:1',

            'polygon' => 'required_if:type,polygon|nullable',
        ]);

        $polygon = is_string($data['polygon']) ? json_decode($data['polygon'], true) : $data['polygon'];
        if (is_array($polygon) && count($polygon) < 3) {
            return redirect()->route('maps.edit', $map->id)->with('error', t('maps.error.polygon'));
        }
        $data['polygon'] = json_encode($polygon);

        $map->update($data);

        return redirect()->route('maps.index', ['business_id' => $map->business_id])->with('success', t('maps.success.update'));
    }

    public function edit(Map $map)
    {
        $this->authorizeMapAccess($map, 'maps.update');

        return Inertia::render('maps/edit', [
            'map' => $map,
            'selectedBusinessId' => $map->business_id,
        ]);
    }

    public function destroy(Map $map)
    {
        $this->authorizeMapAccess($map, 'maps.delete');

        $map->delete();

        return redirect()->route('maps.index', ['business_id' => $map->business_id])->with('success', t('maps.success.delete'));
    }

    private function resolveBusinessId($user, $inputId = null): ?int
    {
        return match (true) {
            $user->hasRole('Owner') => $inputId,
            $user->can('maps.create') => $user->ownedBusiness?->id ?? $user->businesses()->value('businesses.id'),
            default => null,
        };
    }

    private function authorizeMapAccess(Map $map, string $permission = null)
    {
        $user = request()->user();

        if ($user->hasRole('Owner')) {
            return;
        }

        $authBusinessId = $user->ownedBusiness?->id ?? $user->businesses->first()?->id ?? null;

        if (($permission && !$user->can($permission)) || 
            is_null($map->business_id) || 
            ($map->business_id && $map->business_id !== $authBusinessId)
        ) {
            throw new HttpResponseException(
                redirect()->route('maps.index')->with('error', t('maps.error.auth'))
            );
        }
    }
}
