import FitToBounds from '@/components/fit-to-bounds';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

export default function Show({ map }: { map: any }) {
    const toNum = (v: any): number | null => (v == null || v === '' ? null : Number(v));

    let marker: [number, number] | null = null;
    let circle: [number, number] | null = null;
    let radius: number | null = null;
    let polygon: [number, number][] = [];

    const parse = (p: any): [number, number][] => {
        try {
            const data = typeof p === 'string' ? JSON.parse(p) : p;
            if (!Array.isArray(data)) return [];
            return data
                .map((c: any) => {
                    const lat = toNum(c.lat ?? c[0]);
                    const lng = toNum(c.lng ?? c[1]);
                    return lat != null && lng != null ? ([lat, lng] as [number, number]) : null;
                })
                .filter(Boolean) as [number, number][];
        } catch {
            return [];
        }
    };

    if (map.type === 'marker') {
        const lat = toNum(map.lat);
        const lng = toNum(map.lng);
        if (lat != null && lng != null) marker = [lat, lng];
    } else if (map.type === 'circle') {
        const lat = toNum(map.lat);
        const lng = toNum(map.lng);
        const r = toNum(map.radius);
        if (lat != null && lng != null) {
            circle = [lat, lng];
            radius = r;
        }
    } else if (map.type === 'polygon') polygon = parse(map.polygon);

    const points: [number, number][] = [...(marker ? [marker] : []), ...(circle ? [circle] : []), ...polygon];

    const center: [number, number] = points[0] || [56.9496, 24.1052];

    return (
        <AppLayout breadcrumbs={[{ title: 'Maps', href: '/maps' }]}>
            <Head title={`Map #${map.id}`} />
            <div className="container px-4">
                <div className="mx-auto mt-8 max-w-[600px] space-y-2 rounded-lg border p-4">
                    <h1 className="text-2xl text-gray-400">Map #{map.id}</h1>
                    <p className="text-gray-400">
                        <strong>Name:</strong> {map.name || 'No name'}
                    </p>
                    <p className="text-gray-400">
                        <strong>Type:</strong> {map.type}
                    </p>

                    <div className="relative z-50 h-96">
                        <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {marker && (
                                <Marker position={marker}>
                                    <Popup>{map.name}</Popup>
                                </Marker>
                            )}
                            {circle && radius && (
                                <Circle center={circle} radius={radius}>
                                    <Popup>{map.name}</Popup>
                                </Circle>
                            )}
                            {polygon.length > 0 && (
                                <Polygon positions={polygon}>
                                    <Popup>{map.name}</Popup>
                                </Polygon>
                            )}
                            <FitToBounds points={points} />
                        </MapContainer>
                    </div>

                    <p className="text-gray-400">
                        <strong>Created:</strong> {new Date(map.created_at).toLocaleString()}
                    </p>
                    <Link href="/maps" className="text-blue-600 hover:underline dark:text-blue-400">
                        ← Back
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
