import FitToBounds from '@/components/fit-to-bounds';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/t';
import { BreadcrumbItem, Map } from '@/types';
import { Head, Link } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

export default function Show({ map }: { map: Map }) {
    const toNum = (v: any): number | null => (v == null || v === '' ? null : Number(v));
    const t = useT();

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

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.maps'),
            href: '/maps',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('maps.show.title')} #${map.id}`} />
            <meta name="description" content="View map details and shapes" />

            <div className="px-4">
                <div className="mx-auto mt-8 max-w-3xl space-y-6 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('maps.show.label')} #{map.id}</h1>
                            <p className="text-sm text-gray-500">{t('maps.show.text')}</p>
                        </div>
                        <Link
                            href={route('maps.index', { business_id: map.business_id })}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('maps.show.back')}
                        </Link>
                    </div>

                    <div className="grid gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <p>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{t('maps.show.name')}:</span> {map.name || t('maps.show.empty')}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{t('maps.show.type')}:</span> {map.type}
                        </p>
                        <p>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{t('maps.show.created')}:</span> {new Date(map.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="relative z-50 h-[450px] overflow-hidden rounded-lg border border-gray-200 shadow-sm dark:border-white/10">
                        <MapContainer center={center} zoom={12} className="h-full w-full">
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
                </div>
            </div>
        </AppLayout>
    );
}
