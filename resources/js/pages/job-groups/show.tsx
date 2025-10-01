import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from 'react-leaflet';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Groups',
        href: '/job-groups',
    },
    {
        title: 'Show Group',
        href: '/job-groups',
    },
];

function FitToBounds({ points }: { points: [number, number][] }) {
    const map = useMap();
    if (!map || points.length === 0) return null;
    try {
        map.fitBounds(points as any, { padding: [40, 40] });
    } catch {
        map.setView(points[0], 15);
    }
    return null;
}

export default function Show({ group, users, errors, availableMaps }: { group: any; users: any; errors: any; availableMaps: any }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canAdd = useCan('users.add');
    const canRemove = useCan('users.remove');
    const canAddMap = useCan('maps.add');

    function handleUserSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const users = e.currentTarget.elements.namedItem('users') as HTMLSelectElement;
        const selectedUsers = Array.from(users.selectedOptions).map((option) => Number(option.value));

        if (selectedUsers.length === 0) {
            setError('Please select at least one user.');
            return;
        }

        setError(null);
        router.post(route('job-groups.update-users', group.id), { user_ids: selectedUsers });
        setIsModalOpen(false);
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this image?')) {
            router.delete(route('groupImages.destroy', id));
        }
    }

    const map = group.map;
    let markerPos: [number, number] | null = null;
    let circleCenter: [number, number] | null = null;
    let circleRadius: number | null = null;
    let polygonCoords: [number, number][] = [];

    const toNumber = (v: any): number | null => {
        if (v === null || v === undefined || v === '') return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
    };

    if (map?.type === 'marker') {
        const lat = toNumber(map.lat);
        const lng = toNumber(map.lng);
        if (lat !== null && lng !== null) markerPos = [lat, lng];
    }

    if (map?.type === 'circle') {
        const lat = toNumber(map.lat);
        const lng = toNumber(map.lng);
        const r = toNumber(map.radius);
        if (lat !== null && lng !== null && r !== null) {
            circleCenter = [lat, lng];
            circleRadius = r;
        }
    }

    if (map?.type === 'polygon' && map.polygon) {
        try {
            const parsed = typeof map.polygon === 'string' ? JSON.parse(map.polygon) : map.polygon;
            if (Array.isArray(parsed)) {
                polygonCoords = parsed.map((c: any) => [toNumber(c.lat)!, toNumber(c.lng)!]).filter((p) => p[0] !== null && p[1] !== null) as [
                    number,
                    number,
                ][];
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group Show" />

            <div>
                <Link
                    href={route('job-groups.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>
            </div>

            <div>
                <p>
                    <strong>Name:</strong> {group.name}
                </p>
                <p>
                    <strong>Description:</strong> {group.description}
                </p>
            </div>

            <h1 className="py-4 text-xl">Users in the group:</h1>

            {group.users?.map((user: any) => (
                <li key={user.id} className="flex items-center">
                    <span className="mr-2">{user.name}</span>

                    {canRemove && (
                        <Link
                            href={route('job-groups.removeUser', { group: group.id, user: user.id })}
                            method="delete"
                            as="button"
                            className="ml-2 text-red-500 hover:text-red-700"
                        >
                            Remove
                        </Link>
                    )}
                </li>
            ))}

            <div>
                {canAdd && (
                    <button onClick={() => setIsModalOpen(true)} className="rounded-sm bg-blue-500 px-4 py-2 text-white hover:bg-blue-700">
                        Add
                    </button>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-600 bg-opacity-75">
                    <div className="w-full max-w-md rounded-lg bg-gray-400 p-6 dark:bg-gray-700">
                        <h2 className="text-3xl text-gray-700 dark:text-gray-400">Select Users</h2>

                        <form onSubmit={handleUserSubmit}>
                            <select
                                name="users"
                                multiple
                                className="w-full rounded-lg border border-gray-400 bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                            >
                                {users.map((user: any) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>

                            {error && <p className="text-xl text-red-600">{error}</p>}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded bg-red-400 px-4 py-2 text-black hover:bg-red-500"
                                >
                                    Cancel
                                </button>

                                <button type="submit" className="rounded bg-blue-400 px-4 py-2 text-black hover:bg-blue-500">
                                    Add Selected
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <form
                className="px-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    router.post(route('job-groups.images.store', { jobGroup: group.id }), formData, {
                        forceFormData: true,
                    });
                }}
            >
                <input type="file" name="image" accept="image/*" className="rounded-lg border border-gray-400 px-2" />
                {errors.image && <div className="text-center text-sm text-red-500">{errors.image}</div>}
                <button type="submit" className="rounded bg-blue-400 px-4 py-2 text-black hover:bg-blue-500">
                    Upload
                </button>
            </form>

            <div className="mt-4 grid grid-cols-3 gap-4">
                {group.images?.map((img: any) => (
                    <div key={img.id} className="relative">
                        <img src={`data:image/jpeg;base64,${img.image_blob}`} className="rounded-lg shadow-md" />

                        <button
                            onClick={() => handleDelete(img.id)}
                            className="absolute top-2 right-2 rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            {canAddMap && (
                <form
                    className="px-2"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        router.post(route('job-groups.attachMap', { jobGroup: group.id }), formData);
                    }}
                >
                    <select name="map_id" className="rounded-lg border border-gray-400 px-2 py-1">
                        {availableMaps.map((map: any) => (
                            <option key={map.id} value={map.id} className="bg-gray-400">
                                {map.name || `Map #${map.id}`}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="ml-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        Add Map
                    </button>
                </form>
            )}

            <h2 className="py-4 text-xl">Group Map:</h2>

            {group.map && (
                <div className="relative z-50 mx-auto mb-6 h-64 w-full max-w-[600px] overflow-hidden rounded-lg">
                    <MapContainer center={initialCenter} zoom={10} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

                        {markerPos && (
                            <Marker position={markerPos}>
                                <Popup>{group.map.name || `Marker #${group.map.id}`}</Popup>
                            </Marker>
                        )}

                        {circleCenter && circleRadius !== null && circleRadius > 0 && (
                            <Circle center={circleCenter} radius={circleRadius}>
                                <Popup>{group.map.name || `Circle #${group.map.id}`}</Popup>
                            </Circle>
                        )}

                        {polygonCoords.length > 0 && (
                            <Polygon positions={polygonCoords}>
                                <Popup>{group.map.name || `Polygon #${group.map.id}`}</Popup>
                            </Polygon>
                        )}

                        <FitToBounds points={boundsPoints} />
                    </MapContainer>
                </div>
            )}
        </AppLayout>
    );
}
