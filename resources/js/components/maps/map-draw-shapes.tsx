import { router } from '@inertiajs/react';
import axios from 'axios';
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

    useEffect(() => {
        if (!map || initialized.current) return;
        initialized.current = true;

        map.addLayer(drawnItems);

        const drawControl = new (L.Control as any).Draw({
            draw: canCreate ? { polygon: {}, marker: {}, circle: {}, rectangle: false, polyline: false, circlemarker: false } : false,
            edit: {
                featureGroup: drawnItems,
                edit: canEdit ? { selectedPathOptions: { maintainColor: true } } : false,
                remove: canEdit,
            },
        });

        if (canEdit || canCreate) map.addControl(drawControl);

        map.on(L.Draw.Event.CREATED, async (e: any) => {
            const { layerType, layer } = e;
            drawnItems.addLayer(layer);

            const payload: any = { type: layerType };

            if (layerType === 'marker') {
                const { lat, lng } = layer.getLatLng();
                payload.lat = lat;
                payload.lng = lng;
            } else if (layerType === 'circle') {
                const { lat, lng } = layer.getLatLng();
                payload.lat = lat;
                payload.lng = lng;
                payload.radius = layer.getRadius();
            } else if (layerType === 'polygon') {
                const polygon = layer.getLatLngs()[0].map((p: any) => ({
                    lat: p.lat,
                    lng: p.lng,
                }));
                payload.polygon = polygon;
            }

            if (auth.user.roles.includes('Owner')) {
                if (!selectedBusinessId) {
                    alert('Please select a business first.');
                    return;
                }
                payload.business_id = selectedBusinessId;
            }

            try {
                await axios.post('/maps', payload);
                router.reload({ only: ['maps'] });
            } catch (error) {
                console.error('Error saving shape:', error);
            }
        });
    }, [map, canEdit, canCreate, auth, selectedBusinessId]);

    return null;
}
