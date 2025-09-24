import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';
import axios from 'axios';
import L, { LatLng } from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Maps', href: '/maps' },
  { title: 'Edit Map', href: '/maps' },
];

type MapEntry = {
  id: number;
  type: string;
  name?: string;
  lat?: number | null;
  lng?: number | null;
  radius?: number | null;
  polygon?: any;
  created_at: string;
};

type Coordinate = { lat: number; lng: number };

type Data = {
  type: 'marker' | 'polygon' | 'circle';
  name?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  coordinates?: Coordinate[];
};

function FitToBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;
    try {
      map.fitBounds(points as any, { padding: [40, 40] });
    } catch {
      map.setView(points[0], 15);
    }
  }, [map, points]);
  return null;
}

function DrawControls({
  onShapeCreated,
  onShapeEdited,
}: {
  onShapeCreated: (data: Data) => void;
  onShapeEdited: (data: Data) => void;
}) {
  const map = useMap();
  const initializedRef = useRef(false);
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());

  useEffect(() => {
    if (!map || initializedRef.current) return;
    initializedRef.current = true;

    const drawnItems = drawnItemsRef.current;
    map.addLayer(drawnItems);

    const drawControl = new (L.Control as any).Draw({
      edit: { featureGroup: drawnItems },
      draw: { polygon: true, marker: true, circle: true, rectangle: false, polyline: false, circlemarker: false },
    });

    map.addControl(drawControl);

    // Shape created
    map.on((L.Draw as any).Event.CREATED, (e: any) => {
      const { layerType, layer } = e;
      drawnItems.addLayer(layer);

      let data: Data | undefined;
      if (layerType === 'marker') {
        const { lat, lng } = layer.getLatLng();
        data = { type: 'marker', lat, lng };
      } else if (layerType === 'circle') {
        const { lat, lng } = layer.getLatLng();
        data = { type: 'circle', lat, lng, radius: layer.getRadius() };
      } else if (layerType === 'polygon') {
        const coords = layer.getLatLngs()[0].map((ll: LatLng) => ({ lat: ll.lat, lng: ll.lng }));
        data = { type: 'polygon', coordinates: coords };
      }
      if (data) onShapeCreated(data);
    });

    // Shape edited
    map.on((L.Draw as any).Event.EDITED, (e: any) => {
      e.layers.eachLayer((layer: any) => {
        let data: Data | undefined;
        if (layer instanceof L.Marker) {
          const { lat, lng } = layer.getLatLng();
          data = { type: 'marker', lat, lng };
        } else if (layer instanceof L.Circle) {
          const { lat, lng } = layer.getLatLng();
          data = { type: 'circle', lat, lng, radius: layer.getRadius() };
        } else if (typeof layer.getLatLngs === 'function') {
          const coords = layer.getLatLngs()[0].map((ll: LatLng) => ({ lat: ll.lat, lng: ll.lng }));
          data = { type: 'polygon', coordinates: coords };
        }
        if (data) onShapeEdited(data);
      });
    });
  }, [map, onShapeCreated, onShapeEdited]);

  return null;
}

export default function Edit({ map }: { map: MapEntry }) {
  const [center, setCenter] = useState<[number, number] | null>(null);

  const { data, setData, put, errors } = useForm<{
    name: string;
    lat: string | number | null;
    lng: string | number | null;
    radius: string | number | null;
    polygon: string;
    type: string;
  }>({
    name: map.name || '',
    lat: map.lat || '',
    lng: map.lng || '',
    radius: map.radius || '',
    polygon: map.polygon || '',
    type: map.type || '',
  });

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

  const defaultCenter: [number, number] = [56.9496, 24.1052];
  const initialCenter = boundsPoints.length > 0 ? boundsPoints[0] : defaultCenter;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        async () => {
          try {
            const res = await fetch('https://ipapi.co/json/');
            const d = await res.json();
            setCenter([d.latitude, d.longitude]);
          } catch {
            setCenter(defaultCenter);
          }
        },
      );
    } else {
      setCenter(defaultCenter);
    }
  }, []);

  if (!center) return <p>Loading map...</p>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('maps.update', map.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Map" />

      <div className="container px-4">
        <div className="border w-full max-w-[600px] mx-auto rounded-lg space-y-2 p-4 mt-8">
          <h1 className="mb-4 text-center text-2xl font-bold">Edit Map</h1>
          <Link href="/maps" className="text-blue-600 hover:underline dark:text-blue-400">
            ← Back to list
          </Link>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400">Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className="mt-1 w-full rounded-md border p-2"
              />
              {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
            </div>

            {data.type === 'marker' && (
              <>
                <InputField label="Latitude" value={data.lat} onChange={(v) => setData('lat', v)} error={errors.lat} />
                <InputField label="Longitude" value={data.lng} onChange={(v) => setData('lng', v)} error={errors.lng} />
              </>
            )}

            {data.type === 'circle' && (
              <>
                <InputField label="Latitude" value={data.lat} onChange={(v) => setData('lat', v)} error={errors.lat} />
                <InputField label="Longitude" value={data.lng} onChange={(v) => setData('lng', v)} error={errors.lng} />
                <InputField label="Radius" value={data.radius} onChange={(v) => setData('radius', v)} error={errors.radius} />
              </>
            )}

            {data.type === 'polygon' && (
              <div>
                <label className="block text-sm font-medium text-gray-400">Polygon (JSON)</label>
                <textarea
                  value={data.polygon}
                  onChange={(e) => setData('polygon', e.target.value)}
                  className="mt-1 w-full rounded-md border p-2"
                  rows={3}
                />
                {errors.polygon && <div className="text-sm text-red-500">{errors.polygon}</div>}
              </div>
            )}

            <div className="flex justify-end">
              <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                Update
              </button>
            </div>
          </form>

          {/* Map */}
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

              <DrawControls
                onShapeCreated={(shape) => {
                  setData({
                    ...data,
                    type: shape.type,
                    lat: shape.lat ?? '',
                    lng: shape.lng ?? '',
                    radius: shape.radius ?? '',
                    polygon: shape.type === 'polygon' ? JSON.stringify(shape.coordinates ?? []) : '',
                  });
                }}
                onShapeEdited={(shape) => {
                  setData({
                    ...data,
                    type: shape.type,
                    lat: shape.lat ?? '',
                    lng: shape.lng ?? '',
                    radius: shape.radius ?? '',
                    polygon: shape.type === 'polygon' ? JSON.stringify(shape.coordinates ?? []) : '',
                  });
                }}
              />

              <FitToBounds points={boundsPoints} />
            </MapContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function InputField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: any;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-400">{label}</label>
      <input
        type="number"
        step="any"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border p-2"
      />
      {error && <div className="text-sm text-red-500">{error}</div>}
    </div>
  );
}
