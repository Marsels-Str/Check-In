import MapDrawShapes from '@/components/maps/map-draw-shapes';
import NameCell from '@/components/maps/name-cell';
import useMapCenter from '@/hooks/use-map-center';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type BusinessProfile, type Map, type PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Maps', href: '/maps' }];

interface IndexProps extends PageProps {
    maps: Map[];
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
    profile: any;
}

export default function Index({ maps, auth, businesses, selectedBusinessId, profile }: IndexProps) {
    const [activeId, setActiveId] = useState<number | null>(null);
    const center = useMapCenter(profile);

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this entry?')) router.delete(route('maps.destroy', id));
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maps" />

            <h1 className="mb-4 text-center text-3xl font-bold md:text-5xl">Map</h1>

            {auth.user.roles.includes('Owner') && (
                <div className="px-8">
                    <select
                        value={selectedBusinessId || ''}
                        onChange={(e) => router.get(route('maps.index'), { business_id: e.target.value })}
                        className="mb-4 rounded border border-gray-400 bg-gray-400 p-2"
                    >
                        {businesses.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="relative z-50 mb-6 px-8">
                {center ? (
                    <MapContainer center={center} zoom={13} className="h-[550px] w-full rounded-xl">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapDrawShapes canCreate canEdit={auth.user.roles.includes('Owner')} auth={auth} selectedBusinessId={selectedBusinessId} />
                    </MapContainer>
                ) : (
                    <p>Loading map...</p>
                )}
            </div>

            <div className="max-h-64 overflow-y-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            {['ID', 'Name', 'Actions', 'Created At'].map((h) => (
                                <th key={h} className="border-b border-gray-400 py-2 text-xs text-gray-500 uppercase">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {maps.map((map) => (
                            <tr key={map.id} className="text-center">
                                <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">{map.id}</td>
                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    <NameCell id={map.id ?? 0} name={map.name} activeId={activeId} setActiveId={setActiveId} />
                                </td>
                                <td className="border-b border-gray-400">
                                    <Link href={route('maps.show', map.id)} className="text-yellow-500 hover:underline dark:text-yellow-400">
                                        Show
                                    </Link>
                                    <Link href={route('maps.edit', map.id)} className="ml-4 text-blue-500 hover:text-blue-700">
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
