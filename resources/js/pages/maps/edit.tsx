import { useT } from '@/lib/t';
import MapDrawEditor from '@/components/maps/map-editor';
import MapEditorInputs from '@/components/maps/map-editor-inputs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, EditableMap, Map } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

export default function Edit({ map }: { map: Map }) {
    const form = useForm<EditableMap>({
        name: map.name ?? '',
        lat: map.lat ?? '',
        lng: map.lng ?? '',
        radius: map.radius ?? '',
        polygon: map.polygon ?? '',
        type: map.type ?? '',
    });

    // @ts-ignore
    const { data, setData, put, errors, processing } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('maps.update', map.id));
    };

    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.maps'), href: '/maps' },
        { title: t('breadcrumb.maps.edit'), href: '/maps' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('maps.edit.title')} />

            <div className="px-4">
                <div className="mx-auto mt-8 max-w-3xl space-y-6 rounded-xl border border-gray-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-md">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('maps.edit.label')}</h1>
                            <p className="text-sm text-gray-500">{t('maps.edit.text')}</p>
                        </div>
                        <Link
                            href={route('maps.index', { business_id: map.business_id })}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('maps.edit.back')}
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('maps.edit.name')}</Label>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e: any) => setData('name', e.target.value)}
                                placeholder="100"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <MapEditorInputs data={data} setData={setData} errors={errors} />

                        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-white/10">
                            <MapDrawEditor map={map} data={data} setData={setData} />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-4 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 disabled:opacity-50 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                            >
                                {t('maps.edit.save')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
