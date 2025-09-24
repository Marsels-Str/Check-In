import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import L, { LatLng } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Maps',
        href: '/maps',
    },
];

type Profile ={
    country: string;
    city: string;
}

type Coordinate = { lat: number; lng: number };

type Data = {
    type: 'marker' | 'polygon' | 'circle';
    name?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    coordinates?: Coordinate[];
};

type MapEntry = {
    id: number;
    name?: string;
    type: 'marker' | 'polygon' | 'circle';
    lat?: number;
    lng?: number;
    radius?: number;
    polygon?: { lat: number; lng: number }[];
    created_at: string;
};

function handleDelete(mapId: number) {
    if (confirm('Are you sure you want to delete this entry?')) {
        router.delete(route('maps.destroy', mapId));
    }
}


function NameCell({
  id,
  name,
  activeId,
  setActiveId,
}: {
  id: number;
  name?: string;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}) {
  const isOpen = activeId === id;
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setActiveId(isOpen ? null : id)}
        className="text-blue-600 hover:underline dark:text-blue-400"
      >
        Name
      </button>

      {isOpen && (
        <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 z-10 w-48 rounded-lg bg-white p-2 text-sm text-gray-900 shadow-lg dark:bg-gray-700 dark:text-gray-100">
          {name || "No name provided"}
        </div>
      )}
    </div>
  );
}

function DrawControls({ onShapeCreated }: { onShapeCreated: (data: any) => void }) {
    const map = useMap();
    const initializedRef = useRef(false);

    useEffect(() => {
        if (!map || initializedRef.current) return;
        initializedRef.current = true;

        const drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        const drawControl = new (L.Control as any).Draw({
            edit: { featureGroup: drawnItems },
            draw: {
                polygon: true,
                marker: true,
                circle: true,
                circlemarker: false,
                rectangle: false,
                polyline: false,
            },
        });

        map.addControl(drawControl);

        map.on((L.Draw as any).Event.CREATED, async (e: any) => {
            const { layerType, layer } = e;
            drawnItems.addLayer(layer);
            let data: Data | undefined;

            if (layerType === 'marker') {
                const { lat, lng } = layer.getLatLng();
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
                    );
                    const place = await res.json();
                    const addr = place.address || {};
                    const displayName = place.display_name || '';

                    const knownPlace =
                        displayName && !(displayName === addr.city || displayName === addr.town || displayName === addr.village);

                    let popupContent: string;
                    if (knownPlace) {
                        popupContent = `<b>${displayName}</b><br/>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
                    } else {
                        const closest =
                            addr.city || addr.town || addr.village
                                ? addr.road || addr.city || addr.town || addr.village || 'Unknown place'
                                : 'Unknown place';
                        popupContent = `<b>Unknown place</b><br/>Closest: ${closest}<br/>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
                    }
                    layer.bindPopup(popupContent).openPopup();
                    data = { type: 'marker', lat, lng, name: knownPlace ? displayName : undefined };
                } catch (err) {
                    layer.bindPopup(`<b>Unknown place</b><br/>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`).openPopup();
                    data = { type: 'marker', lat, lng };
                }
            } else if (layerType === 'polygon') {
                const coords = layer.getLatLngs()[0].map((latlng: LatLng) => ({ lat: latlng.lat, lng: latlng.lng }));
                data = { type: 'polygon', coordinates: coords };
            } else if (layerType === 'circle') {
                const { lat, lng } = layer.getLatLng();
                data = { type: 'circle', lat, lng, radius: layer.getRadius() };
            }

            if (data) onShapeCreated(data);
        });
    }, [map, onShapeCreated]);

    return null;
}

export default function Index({ maps, profile }: { maps: MapEntry[], profile: Profile | null }) {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [center, setCenter] = useState<[number, number] | null>(null);

    useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter([pos.coords.latitude, pos.coords.longitude]);
            },
            async () => {
                // Fallback: geocode profile data
                try {
                    if (profile?.country || profile?.city) {
                        const query = encodeURIComponent(
                            `${profile.city ?? ''}, ${profile.country ?? ''}`
                        );

                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
                        );
                        const results = await res.json();

                        if (results.length > 0) {
                            setCenter([
                                parseFloat(results[0].lat),
                                parseFloat(results[0].lon),
                            ]);
                            return;
                        }
                    }

                    // Default fallback if nothing else works
                    setCenter([56.9496, 24.1052]);
                } catch {
                    setCenter([56.9496, 24.1052]);
                }
            }
        );
    } else {
        setCenter([56.9496, 24.1052]);
    }
}, [profile]);

    const handleShapeCreated = async (data: Data) => {
        const payload: any = {};

        if (data.name) {
            payload.name = data.name;
        }

        switch (data.type) {
            case 'marker':
                payload.type = 'marker';
                payload.lat = data.lat;
                payload.lng = data.lng;
                break;

            case 'circle':
                payload.type = 'circle';
                payload.lat = data.lat;
                payload.lng = data.lng;
                payload.radius = data.radius;
                break;

            case 'polygon':
                payload.type = 'polygon';
                payload.polygon = data.coordinates;
                break;
        }
        try {
            await axios.post('/maps', payload);
        } catch (error) {
            console.error('Error saving shape:', error);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head>
                <title>Maps</title>
            </Head>
            <h1 className="text-center text-3xl leading-tight font-bold md:text-5xl">Map</h1>

            <div className="relative z-50">
                {center ? (
                <MapContainer center={center} zoom={20} className="h-[500px] w-full rounded-xl sm:h-[500px]">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
                    <DrawControls onShapeCreated={handleShapeCreated} />
                </MapContainer>
                 ) : (
                     <p>Loading map...</p>
                 )}
            </div>

            <div className="max-h-64 overflow-y-auto">
                <table className="mt-4 min-h-full w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border-b border-gray-400 py-2 text-xs text-gray-500 uppercase dark:text-gray-400">ID</th>
                            <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">Name</th>
                            <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">Coordinates</th>
                            <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">Actions</th>
                            <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {maps.map((map: MapEntry) => (
                            <tr key={map.id} className="text-center">
                                <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">{map.id}</td>

                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    <NameCell id={map.id} name={map.name} activeId={activeId} setActiveId={setActiveId} />
                                </td>

                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    <Link href={route('maps.show', map.id)} className="text-yellow-500 hover:underline dark:text-yellow-400">
                                        Show
                                    </Link>
                                </td>

                                <td className="border-b border-gray-400">
                                    <Link href={route('maps.edit', map.id)} className="text-blue-500 hover:text-blue-700">
                                        Edit
                                    </Link>

                                    <button onClick={() => handleDelete(map.id)} className="ml-4 text-red-500 hover:text-red-700 focus:outline-none">
                                        Delete
                                    </button>
                                </td>

                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    {new Date(map.created_at).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
