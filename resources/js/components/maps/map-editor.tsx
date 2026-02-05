import FitToBounds from '@/components/fit-to-bounds';
import { EditableMap, Map } from '@/types';
import L, { LatLng } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';

interface Props {
    map: Map;
    data: EditableMap;
    setData: (key: keyof EditableMap | EditableMap, value?: any) => void;
}

export default function MapDrawEditor({ map, data, setData }: Props) {
    const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
    const initializedRef = useRef(false);

    const toNumber = (v: any): number | null => {
        if (v === null || v === undefined || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    let markerPos: [number, number] | null = null;
    let circleCenter: [number, number] | null = null;
    let circleRadius: number | null = null;
    let polygonCoords: [number, number][] = [];

    if (map.type === 'marker') {
        const lat = toNumber(map.lat);
        const lng = toNumber(map.lng);
        if (lat !== null && lng !== null) markerPos = [lat, lng];
    }

    if (map.type === 'circle') {
        const lat = toNumber(map.lat);
        const lng = toNumber(map.lng);
        const r = toNumber(map.radius);
        if (lat !== null && lng !== null) {
            circleCenter = [lat, lng];
            circleRadius = r ?? null;
        }
    }

    if (map.type === 'polygon' && map.polygon) {
        try {
            const parsed = typeof map.polygon === 'string' ? JSON.parse(map.polygon) : map.polygon;
            if (Array.isArray(parsed)) {
                polygonCoords = parsed.map((c: any) => [toNumber(c.lat)!, toNumber(c.lng)!]).filter(Boolean) as [number, number][];
            }
        } catch (e) {
            console.error('Polygon parse error:', e);
        }
    }

    const boundsPoints: [number, number][] = [];
    if (markerPos) boundsPoints.push(markerPos);
    if (circleCenter) boundsPoints.push(circleCenter);
    if (polygonCoords.length) boundsPoints.push(...polygonCoords);

    const DrawLogic = () => {
        const mapInstance = useMap();

        useEffect(() => {
            if (!mapInstance || initializedRef.current) return;
            initializedRef.current = true;

            const drawnItems = drawnItemsRef.current;
            mapInstance.addLayer(drawnItems);

            if ((L.Control as any).Draw) {
                const drawControl = new (L.Control as any).Draw({
                    edit: { featureGroup: drawnItems },
                    draw: { polygon: true, marker: true, circle: true, rectangle: false, polyline: false, circlemarker: false },
                });
                mapInstance.addControl(drawControl);
            } else {
                console.error('Leaflet Draw failed to load.');
            }

            mapInstance.on((L.Draw as any).Event.CREATED, (e: any) => {
                const { layerType, layer } = e;
                drawnItems.addLayer(layer);

                let shape: EditableMap | undefined;
                if (layerType === 'marker') {
                    const { lat, lng } = layer.getLatLng();
                    shape = { type: 'marker', lat, lng };
                } else if (layerType === 'circle') {
                    const { lat, lng } = layer.getLatLng();
                    shape = { type: 'circle', lat, lng, radius: layer.getRadius() };
                } else if (layerType === 'polygon') {
                    const coords = layer.getLatLngs()[0].map((ll: LatLng) => ({ lat: ll.lat, lng: ll.lng }));
                    shape = { type: 'polygon', polygon: JSON.stringify(coords) };
                }

                if (shape) setData({ ...data, ...shape });
            });

            mapInstance.on((L.Draw as any).Event.EDITED, (e: any) => {
                e.layers.eachLayer((layer: any) => {
                    let shape: EditableMap | undefined;
                    if (layer instanceof L.Marker) {
                        const { lat, lng } = layer.getLatLng();
                        shape = { type: 'marker', lat, lng };
                    } else if (layer instanceof L.Circle) {
                        const { lat, lng } = layer.getLatLng();
                        shape = { type: 'circle', lat, lng, radius: layer.getRadius() };
                    } else if (typeof layer.getLatLngs === 'function') {
                        const coords = layer.getLatLngs()[0].map((ll: LatLng) => ({ lat: ll.lat, lng: ll.lng }));
                        shape = { type: 'polygon', polygon: JSON.stringify(coords) };
                    }
                    if (shape) setData({ ...data, ...shape });
                });
            });
        }, [mapInstance]);

        return null;
    };

    return (
        <div className="h-[400px]">
            <MapContainer center={boundsPoints[0] ?? [56.9496, 24.1052]} zoom={10} style={{ height: '100%', width: '100%' }}>
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

                <DrawLogic />
                <FitToBounds points={boundsPoints} />
            </MapContainer>
        </div>
    );
}
