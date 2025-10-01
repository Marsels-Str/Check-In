import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Maps',
        href: '/maps',
    },
    {
        title: 'Show Map',
        href: '/maps',
    },
];

type MapEntry = {
    id: number;
    type: string;
    name?: string;
    lat?: number | string | null;
    lng?: number | string | null;
    radius?: number | string | null;
    polygon?: any;
    created_at: string;
};

function FitToBounds({ points }: { points: [number, number][] }) {
    const map = useMap();
    if (!map) return null;
    if (points.length === 0) return null;

    try {
        map.fitBounds(points as any, { padding: [40, 40] });
    } catch (e) {
        map.setView(points[0], 15);
    }
    return null;
}

export default function Show({ map }: { map: MapEntry }) {
    let markerPos: [number, number] | null = null;
    let circleCenter: [number, number] | null = null;
    let circleRadius: number | null = null;
    let polygonCoords: [number, number][] = [];

    const toNumber = (v: any): number | null => {
        if (v === null || v === undefined || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    if (map.type === 'marker') {
        const lat = toNumber(map.lat);
        const lng = toNumber(map.lng);
        if (lat !== null && lng !== null) markerPos = [lat, lng];
    }

    if (map.type === 'circle') {
        let lat = toNumber(map.lat);
        let lng = toNumber(map.lng);
        let r = toNumber(map.radius);

        if ((lat === null || lng === null || r === null) && map.polygon) {
            try {
                const parsed = typeof map.polygon === 'string' ? JSON.parse(map.polygon) : map.polygon;
                if (parsed && typeof parsed === 'object') {
                    if (parsed.type === 'circle' && parsed.lat != null && parsed.lng != null) {
                        lat = toNumber(parsed.lat) ?? lat;
                        lng = toNumber(parsed.lng) ?? lng;
                        r = toNumber(parsed.radius) ?? r;
                    }
                }
            } catch (e) {
                console.warn('Circle fallback parse failed', e);
            }
        }

        if (lat !== null && lng !== null) {
            circleCenter = [lat, lng];
            circleRadius = r ?? null;
        }
    }

    if (map.type === 'polygon' && map.polygon) {
        try {
            const parsed = typeof map.polygon === 'string' ? JSON.parse(map.polygon) : map.polygon;

            if (Array.isArray(parsed)) {
                if (parsed.length > 0 && typeof parsed[0] === 'object' && 'lat' in parsed[0]) {
                    polygonCoords = parsed.map((c: any) => [toNumber(c.lat)!, toNumber(c.lng)!]).filter((p) => p[0] !== null && p[1] !== null) as [
                        number,
                        number,
                    ][];
                } else if (parsed.length > 0 && Array.isArray(parsed[0])) {
                    polygonCoords = parsed
                        .map((pair: any) => [toNumber(pair[0])!, toNumber(pair[1])!])
                        .filter((p) => p[0] !== null && p[1] !== null) as [number, number][];
                }
            } else if (parsed && parsed.coordinates && Array.isArray(parsed.coordinates)) {
                polygonCoords = parsed.coordinates
                    .map((c: any) => [toNumber(c.lat)!, toNumber(c.lng)!])
                    .filter((p: any) => p[0] !== null && p[1] !== null) as [number, number][];
            }
        } catch (e) {
            console.error('Polygon parse error:', e, map.polygon);
        }
    }

    const boundsPoints: [number, number][] = [];
    if (markerPos) boundsPoints.push(markerPos);
    if (circleCenter) boundsPoints.push(circleCenter);
    if (polygonCoords.length) boundsPoints.push(...polygonCoords);

    const defaultCenter: [number, number] = [56.9496, 24.1052];

    const initialCenter = boundsPoints.length > 0 ? boundsPoints[0] : defaultCenter;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Map Entry #${map.id}`} />

            <div className="container px-4">
                <div className="boder-gray-400 mx-auto mt-8 w-full max-w-[600px] space-y-2 rounded-lg border p-4">
                    <h1 className="text-2xl text-gray-400">Map Entry #{map.id}</h1>

                    <p className="text-gray-400">
                        <strong>Name:</strong> {map.name || 'if no name go to edit and add a name'}
                    </p>
                    <p className="text-gray-400">
                        <strong>Type:</strong> {map.type}
                    </p>

                    <div className="relative z-50 h-96">
                        <MapContainer center={initialCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                            {markerPos && (
                                <Marker position={markerPos}>
                                    <Popup>{map.name || `Marker #${map.id}`}</Popup>
                                </Marker>
                            )}

                            {circleCenter && circleRadius !== null && circleRadius > 0 && (
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

                    <p className="text-gray-400">
                        <strong>Created At:</strong> {new Date(map.created_at).toLocaleString()}
                    </p>

                    <Link href="/maps" className="text-blue-600 hover:underline dark:text-blue-400">
                        ← Back to list
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
