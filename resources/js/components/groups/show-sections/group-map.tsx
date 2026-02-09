import FitToBounds from '@/components/fit-to-bounds';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCan } from '@/lib/can';
import { useT } from '@/lib/t';
import { GroupMaps } from '@/types';
import { Form, router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

interface Props {
    group: GroupMaps;
    availableMaps: any;
}

export default function GroupMap({ group, availableMaps }: Props) {
    const canAttachMap = useCan('groups.attachMap');
    const canDetachMap = useCan('groups.detachMap');
    const map = group.map;

    const t = useT();

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
                console.error('Invalid polygon');
            }
        }
    }

    const boundsPoints = [...(markerPos ? [markerPos] : []), ...(circleCenter ? [circleCenter] : []), ...polygonCoords];
    const initialCenter: [number, number] = boundsPoints[0] || [56.9496, 24.1052];

    const mapsDetach = (mapId: number) => {
        router.delete(route('groups.detach-map', group.id), {
            data: { map_id: mapId },
        });
    };

    return (
        <div>
            <div className="mx-auto max-w-5xl space-y-2 p-2">
                {canAttachMap && (
                    <Form
                        method="post"
                        action={route('groups.attach-map', { group: group.id })}
                        className="flex items-center space-x-2"
                    >
                        {({ errors }) => (
                            <>
                                <div className="flex h-[160px] flex-1 flex-col overflow-y-auto">
                                    <Label>{t('groups.show.maps.label')}:</Label>
                                    <div className="space-y-2 overflow-y-auto">
                                        {availableMaps.map((maps: any) => (
                                            <div
                                                key={maps.id}
                                                className="flex justify-between rounded-lg border bg-background hover:bg-muted px-4 py-2"
                                            >
                                                <Label htmlFor={`map-${maps.id}`} className="flex cursor-pointer items-center space-x-2">
                                                    <Input
                                                        type="radio"
                                                        name="map_id"
                                                        value={maps.id}
                                                        id={`map-${maps.id}`}
                                                        className="h-4 w-4 accent-yellow-700 dark:accent-yellow-400"
                                                    />
                                                    <span className="dark:text-white">{maps.name || `Map #${maps.id}`}</span>
                                                </Label>

                                                {canDetachMap && map?.id === maps.id && (
                                                    <Button
                                                        onClick={() => mapsDetach(maps.id)}
                                                        type="button"
                                                        variant="link"
                                                        className="px-0 text-red-700 dark:text-red-500"
                                                    >
                                                        {t('groups.show.maps.detach')}
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <InputError message={errors.map_id} />
                                </div>

                                <Button variant="default">
                                    {t('groups.show.maps.add')}
                                </Button>
                            </>
                        )}
                    </Form>
                )}

                {map ? (
                    <div className="relative h-80 overflow-hidden rounded-xl border">
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
                    <p className="p-2 text-center text-muted-foreground italic">{t('groups.show.maps.empty')}</p>
                )}
            </div>
        </div>
    );
}
