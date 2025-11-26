import FitToBounds from '@/components/fit-to-bounds';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

export default function GroupMap({ group, availableMaps, canAddMap }: any) {
    const map = group.map;

    const toNum = (v: any): number | null => {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    let markerPos: [number, number] | null = null;
    let circleCenter: [number, number] | null = null;
    let circleRadius: number | null = null;
    let polygonCoords: [number, number][] = [];

    if (map) {
        if (map.type === 'marker') {
            const lat = toNum(map.lat),
                lng = toNum(map.lng);
            if (lat && lng) markerPos = [lat, lng];
        }

        if (map.type === 'circle') {
            const lat = toNum(map.lat),
                lng = toNum(map.lng),
                r = toNum(map.radius);
            if (lat && lng && r) {
                circleCenter = [lat, lng];
                circleRadius = r;
            }
        }

        if (map.type === 'polygon' && map.polygon) {
            try {
                const parsed = typeof map.polygon === 'string' ? JSON.parse(map.polygon) : map.polygon;
                polygonCoords = Array.isArray(parsed)
                    ? (parsed.map((c: any) => [toNum(c.lat), toNum(c.lng)]).filter(([lat, lng]) => lat && lng) as [number, number][])
                    : [];
            } catch {
                console.error('Invalid polygon JSON');
            }
        }
    }

    const boundsPoints = [...(markerPos ? [markerPos] : []), ...(circleCenter ? [circleCenter] : []), ...polygonCoords];
    const initialCenter: [number, number] = boundsPoints[0] || [56.9496, 24.1052];

    return (
        <div className="mt-8">
            <div className="mx-auto max-w-5xl p-4">
                {canAddMap && (
                    <Form
                        method="post"
                        action={route('job-groups.attachMap', { jobGroup: group.id })}
                        className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
                    >
                        {({ errors }) => (
                            <>
                                <div className="flex h-[140px] flex-1 flex-col gap-2 overflow-y-auto">
                                    <Label>Select a map:</Label>
                                    <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
                                        {availableMaps.map((map: any) => (
                                            <Label
                                                key={map.id}
                                                htmlFor={`map-${map.id}`}
                                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 hover:bg-gray-100 dark:border-gray-600 dark:bg-[#101010] dark:hover:bg-[#1a1a1a]"
                                            >
                                                <Input
                                                    type="radio"
                                                    name="map_id"
                                                    value={map.id}
                                                    id={`map-${map.id}`}
                                                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 dark:border-gray-500 dark:bg-gray-800 dark:focus:ring-yellow-500"
                                                />
                                                <span className="text-gray-800 dark:text-gray-200">{map.name || `Map #${map.id}`}</span>
                                            </Label>
                                        ))}
                                    </div>
                                    <InputError message={errors.map_id} />
                                </div>

                                <Button
                                    type="submit"
                                    className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                >
                                    Add
                                </Button>
                            </>
                        )}
                    </Form>
                )}

                {map ? (
                    <div className="relative mt-4 h-80 overflow-hidden rounded-xl border shadow-md">
                        <MapContainer center={initialCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                            {markerPos && (
                                <Marker position={markerPos}>
                                    <Popup>{map.name || `Marker #${map.id}`}</Popup>
                                </Marker>
                            )}
                            {circleCenter && circleRadius && (
                                <Circle center={circleCenter} radius={circleRadius}>
                                    <Popup>{map.name || `Circle #${map.id}`}</Popup>
                                </Circle>
                            )}
                            {polygonCoords.length > 0 && (
                                <Polygon positions={polygonCoords}>
                                    <Popup>{map.name || `Polygon #${map.id}`}</Popup>
                                </Polygon>
                            )}
                            <FitToBounds points={boundsPoints} />
                        </MapContainer>
                    </div>
                ) : (
                    <p className="mt-3 text-gray-500">No map attached to this group.</p>
                )}
            </div>
        </div>
    );
}
