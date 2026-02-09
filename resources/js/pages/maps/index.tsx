import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import MapDrawShapes from '@/components/maps/map-draw-shapes';
import NameCell from '@/components/maps/name-cell';
import { Button } from '@/components/ui/button';
import useMapCenter from '@/hooks/use-map-center';
import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { useT } from '@/lib/t';
import { BreadcrumbItem, BusinessProfile, Map, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import 'leaflet/dist/leaflet.css';
import { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

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
    const canCreate = useCan('maps.create');
    const canUpdate = useCan('maps.update');
    const canDelete = useCan('maps.delete');
    const canShow = useCan('maps.show');
    const canAccess = useCan('business.access');

    const t = useT();

    function handleBusinessChange(id: number | any) {
        setCurrentBusinessId(id);
        router.visit(route('maps.index'), {
            method: 'get',
            data: { business_id: id },
            preserveState: true,
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.maps'),
            href: '/maps',
        },
    ];

    const mapsEdit = (map: Map) => {
        router.get(route('maps.edit', map.id));
    };

    const mapsShow = (map: Map) => {
        router.get(route('maps.show', map.id));
    };

    const mapsDelete = (map: Map) => {
        router.delete(route('maps.destroy', map.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('maps.index.title')} />
            <meta name="description" content="Manage maps and their shapes within the application" />

            <div className="space-y-4 p-2 px-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('maps.index.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('maps.index.text')}</p>
                    </div>

                    {canAccess && (
                        <BusinessDropdownMenu businesses={businesses} selectedBusinessId={currentBusinessId} onChange={handleBusinessChange} />
                    )}
                </div>

                <div className="relative z-50 rounded-lg border bg-white dark:bg-background">
                    {center ? (
                        <MapContainer center={center} zoom={13} className="h-[500px] w-full rounded-lg">
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <MapDrawShapes canCreate={canCreate} canUpdate={canUpdate} auth={auth} selectedBusinessId={currentBusinessId} />
                        </MapContainer>
                    ) : (
                        <div className="p-6 text-center text-muted-foreground italic">{t('maps.index.loading')}...</div>
                    )}
                </div>

                <div className="overflow-hidden rounded-lg border bg-white dark:bg-background">
                    <div className="max-h-[305px] overflow-y-auto">
                        <table className="min-w-full divide-y">
                            <thead className="sticky top-0 z-10 bg-muted">
                                <tr className="text-left">
                                    <th className="px-4 py-2 dark:text-white">{t('maps.index.id')}</th>
                                    <th className="px-4 py-2 dark:text-white">{t('maps.index.name')}</th>
                                    <th className="px-4 py-2 dark:text-white">{t('maps.index.created')}</th>
                                    <th className="px-4 py-2 text-right dark:text-white">{t('maps.index.actions')}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {maps.length ? (
                                    maps.map((map) => (
                                        <tr key={map.id} className="hover:bg-muted">
                                            <td className="px-4 py-2 dark:text-white">{map.id}</td>

                                            <td className="px-4 py-2 dark:text-white">
                                                <NameCell id={map.id ?? 0} name={map.name} activeId={activeId} setActiveId={setActiveId} />
                                            </td>

                                            <td className="px-4 py-2 text-muted-foreground">{new Date(map.created_at).toLocaleString()}</td>

                                            <td className="space-x-2 px-4 py-2 text-right">
                                                {canShow && (
                                                    <Button
                                                        variant="link"
                                                        className="px-0 text-blue-700 dark:text-blue-500"
                                                        onClick={() => mapsShow(map)}
                                                    >
                                                        {t('maps.index.show')}
                                                    </Button>
                                                )}
                                                {canUpdate && (
                                                    <Button
                                                        variant="link"
                                                        className="px-0 text-yellow-700 dark:text-yellow-500"
                                                        onClick={() => mapsEdit(map)}
                                                    >
                                                        {t('maps.index.edit')}
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="link"
                                                        className="px-0 text-red-700 dark:text-red-500"
                                                        onClick={() => mapsDelete(map)}
                                                    >
                                                        {t('maps.index.delete')}
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground italic">
                                            {t('maps.index.empty')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
