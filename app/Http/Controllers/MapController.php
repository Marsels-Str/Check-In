<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Inertia\Inertia;
use Illuminate\Http\Request;

class MapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $maps = Map::all();
        $profile =  auth()->user()->profile;

        return Inertia::render('maps/index', [
            'maps' => $maps,
            'profile' => $profile
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string',
            'lat' => 'nullable|numeric|min:0',
            'lng' => 'nullable|numeric|min:0',
            'radius' => 'nullable|numeric|min:0',
            'polygon' => 'nullable',
            'type' => 'nullable|string',
        ]);

        if (!empty($data['polygon']) && !is_string($data['polygon'])) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        $map = Map::create($data);

        return response()->json($map, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $map = Map::findOrFail($id);
        return inertia('maps/show', [
            'map' => $map
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $map = Map::findOrFail($id);

        return inertia('maps/edit', [
        'map' => $map,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $map = Map::findOrFail($id);
        
            $data = $request->validate([
            'name' => 'nullable|string',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
            'radius' => 'nullable|numeric',
            'polygon' => 'nullable',
            'type' => 'nullable|string',
        ]);

        if (!empty($data['polygon']) && !is_string($data['polygon'])) {
            $data['polygon'] = json_encode($data['polygon']);
        }

        $map->update($data);

        return redirect()->route('maps.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Map::destroy($id);

        return redirect()->route('maps.index');
    }
}
