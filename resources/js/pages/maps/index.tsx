import BusinessDropdownMenu from '@/components/business-dropdown-menu';
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
    const [currentBusinessId, setCurrentBusinessId] = useState(selectedBusinessId);
    const [activeId, setActiveId] = useState<number | null>(null);
    const center = useMapCenter(profile);

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this entry?')) router.delete(route('maps.destroy', id));
    }

    function handleBusinessChange(id: number | any) {
        setCurrentBusinessId(id);
        router.visit(route('maps.index'), {
            method: 'get',
            data: { business_id: id },
            preserveState: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Maps" />

            <div className="px-4">
                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Maps</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">View, edit, and manage youre maps.</p>
                    </div>

                    {/* Business Dropdown */}
                    {auth.user.roles.includes('Owner') && (
                        <BusinessDropdownMenu businesses={businesses} selectedBusinessId={currentBusinessId} onChange={handleBusinessChange} />
                    )}
                </div>

                {/* Map Display */}
                <div className="relative z-50 mb-10 rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    {center ? (
                        <MapContainer center={center} zoom={13} className="h-[550px] w-full rounded-lg">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapDrawShapes
                                canCreate={auth.user.roles.includes('Owner') || auth.user.roles.includes('Business')}
                                canEdit={auth.user.roles.includes('Owner') || auth.user.roles.includes('Business')}
                                auth={auth}
                                selectedBusinessId={selectedBusinessId}
                            />
                        </MapContainer>
                    ) : (
                        <div className="p-6 text-center text-gray-600 dark:text-gray-400">Loading map...</div>
                    )}
                </div>

                {/* Table Section */}
                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 max-h-[340px] overflow-y-auto md:max-h-[230px]">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="sticky top-0 z-10 bg-gray-50 backdrop-blur-sm dark:bg-[#0f0f0f]/95">
                                <tr>
                                    <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">ID</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Name</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Created At</th>
                                    <th className="py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {maps.map((map) => (
                                    <tr key={map.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                                        <td className="py-4 pr-3 pl-6 text-sm text-gray-900 dark:text-gray-200">{map.id}</td>
                                        <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-200">
                                            <NameCell id={map.id ?? 0} name={map.name} activeId={activeId} setActiveId={setActiveId} />
                                        </td>
                                        <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">
                                            {new Date(map.created_at).toLocaleString()}
                                        </td>
                                        <td className="py-4 pr-6 pl-3 text-right text-sm">
                                            <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                                <Link href={route('maps.show', map.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                                    Show
                                                </Link>
                                                <Link href={route('maps.edit', map.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(map.id)}
                                                    className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
