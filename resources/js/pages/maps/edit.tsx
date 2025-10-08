import MapDrawEditor from '@/components/maps/map-editor';
import MapEditorInputs from '@/components/maps/map-editor-inputs';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, EditableMap, Map } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Maps', href: '/maps' },
    { title: 'Edit Map', href: '/maps' },
];

export default function Edit({ map }: { map: Map }) {
    const form = useForm<EditableMap>({
        name: map.name ?? '',
        lat: map.lat ?? '',
        lng: map.lng ?? '',
        radius: map.radius ?? '',
        polygon: map.polygon ?? '',
        type: map.type ?? '',
    });

    const { data, setData, put, errors } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('maps.update', map.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Map" />

            <div className="container px-4">
                <div className="mx-auto mt-8 w-full max-w-[650px] space-y-4 rounded-lg border border-gray-300 p-5 shadow-sm">
                    <h1 className="mb-4 text-center text-2xl font-bold text-gray-800 dark:text-white">Edit Map</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.name && <div className="text-sm text-red-500">{errors.name}</div>}
                        </div>

                        <MapEditorInputs data={data} setData={setData} errors={errors} />

                        <MapDrawEditor map={map} data={data} setData={setData} />

                        <Link href="/maps" className="text-blue-600 hover:underline dark:text-blue-400">
                            ← Back to list
                        </Link>

                        <div className="flex justify-end pt-2">
                            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50">
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
