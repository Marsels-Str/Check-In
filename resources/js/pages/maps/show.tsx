import FitToBounds from '@/components/fit-to-bounds';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/t';
import { BreadcrumbItem, Map } from '@/types';
import { Head, router } from '@inertiajs/react';
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

    const mapsBack = (map: Map) => {
        router.get(route('maps.index', map.business_id), {
            business_id: map.business_id,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('maps.show.title')} #${map.id}`} />
            <meta name="description" content="View map details and shapes" />

            <div className="p-10">
                <div className="mx-auto max-w-3xl space-y-6 rounded-xl border bg-background p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold dark:text-white">
                                {t('maps.show.label')} #{map.id}
                            </h1>
                            <p className="text-sm text-muted-foreground">{t('maps.show.text')}</p>
                        </div>
                        <Button type="button" variant="outline" onClick={() => mapsBack(map)}>
                            {t('maps.show.back')}
                        </Button>
                    </div>

                    <div className="text-muted-foreground">
                        <p>
                            <span className="font-bold text-foreground">{t('maps.show.name')}:</span> {map.name || t('maps.show.empty')}
                        </p>

                        <p>
                            <span className="font-bold text-foreground">{t('maps.show.type')}:</span> {map.type}
                        </p>

                        <p>
                            <span className="font-bold text-foreground">{t('maps.show.created')}:</span> {new Date(map.created_at).toLocaleString()}
                        </p>
                    </div>

                    <div className="relative z-50 h-[450px] overflow-hidden rounded-lg border">
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
