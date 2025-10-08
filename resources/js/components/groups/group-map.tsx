import FitToBounds from '@/components/fit-to-bounds';
import { router } from '@inertiajs/react';
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

    const handleAttach = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.post(route('job-groups.attachMap', { jobGroup: group.id }), new FormData(e.currentTarget));
    };

    return (
        <div className="mt-8">
            <div className="mx-auto max-w-5xl p-4">
                {canAddMap && (
                    <form onSubmit={handleAttach} className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                        <select
                            name="map_id"
                            className="flex-1 rounded-lg border border-gray-300 bg-gray-400 px-3 py-2 text-gray-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 dark:border-gray-600 dark:text-gray-100"
                        >
                            {availableMaps.map((m: any) => (
                                <option key={m.id} value={m.id}>
                                    {m.name || `Map #${m.id}`}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-2 whitespace-nowrap text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                        >
                            Add
                        </button>
                    </form>
                )}

                {map ? (
                    <div className="relative mt-4 h-80 overflow-hidden rounded-xl border border-gray-300 shadow-md dark:border-gray-700">
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
                    <p className="mt-3 text-gray-500 dark:text-gray-400">No map attached to this group.</p>
                )}
            </div>
        </div>
    );
}
