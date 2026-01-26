import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

export default function MapDrawShapes({ canEdit = false, canCreate = false, auth, selectedBusinessId }: any) {
    const map = useMap();
    const drawnItems = useRef(new L.FeatureGroup()).current;
    const initialized = useRef(false);
    const canAccess = useCan('business.access');

    useEffect(() => {
        if (!map || initialized.current) return;
        initialized.current = true;

        map.addLayer(drawnItems);

        if (canEdit || canCreate) {
            const drawControl = new (L.Control as any).Draw({
                draw: canCreate ? { polygon: {}, marker: {}, circle: {}, rectangle: false, polyline: false, circlemarker: false } : false,
                edit: {
                    featureGroup: drawnItems,
                    edit: canEdit ? { selectedPathOptions: { maintainColor: true } } : false,
                    remove: canEdit,
                },
            });
            map.addControl(drawControl);
        }
    }, [map, canEdit, canCreate]);

    useEffect(() => {
        if (!map) return;

        const handleCreate = async (e: any) => {
            const { layerType, layer } = e;
            drawnItems.addLayer(layer);

            const payload: any = { type: layerType };

            const extractLatLng = () => {
                const { lat, lng } = layer.getLatLng();
                payload.lat = lat;
                payload.lng = lng;
            };

            if (layerType === 'marker') {
                extractLatLng();
            } else if (layerType === 'circle') {
                extractLatLng();
                payload.radius = layer.getRadius();
            } else if (layerType === 'polygon') {
                payload.polygon = layer.getLatLngs()[0].map(({ lat, lng }: any) => ({ lat, lng }));
            }

            if (canAccess) {
                if (!selectedBusinessId) {
                    alert('Please select a business first.');
                    return;
                }
                payload.business_id = selectedBusinessId;
            }

            try {
                router.post('/maps', payload, {
                    preserveScroll: true,
                });
            } catch (error: any) {
                const errors = error.response?.data?.errors;
                const message = errors ? Object.values(errors).flat().join('\n') : 'Error saving shape. Please check your input.';
                alert(message);
                console.error('Error saving shape:', error);
            }
        };

        map.on(L.Draw.Event.CREATED, handleCreate);

        return () => {
            map.off(L.Draw.Event.CREATED, handleCreate);
        };
    }, [map, auth, selectedBusinessId]);

    return null;
}
