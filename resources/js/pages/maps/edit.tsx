import InputError from '@/components/input-error';
import MapDrawEditor from '@/components/maps/map-editor';
import MapEditorInputs from '@/components/maps/map-editor-inputs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { useT } from '@/lib/t';
import { BreadcrumbItem, EditableMap, Map } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
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
    const { data, setData, put, errors } = form;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('maps.update', map.id));
    };

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.maps'), href: '/maps' },
        { title: t('breadcrumb.maps.edit'), href: '/maps' },
    ];

    const mapsBack = (map: Map) => {
        router.get(route('maps.index', map.business_id), {
            business_id: map.business_id,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('maps.edit.title')} />
            <meta name="description" content="Edit an existing map" />

            <div className="p-10">
                <div className="mx-auto max-w-3xl rounded-xl border bg-background p-4 shadow-xl">
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-xl font-bold dark:text-white">{t('maps.edit.label')}</h1>
                            <p className="text-sm text-muted-foreground">{t('maps.edit.text')}</p>
                        </div>
                        <Button type="button" variant="outline" onClick={() => mapsBack(map)}>
                            {t('maps.edit.back')}
                        </Button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <Label className="text-sm dark:text-white">{t('maps.edit.name')}</Label>
                            <Input type="text" value={data.name} onChange={(e: any) => setData('name', e.target.value)} placeholder="100" />
                            <InputError message={errors.name} />

                            <MapEditorInputs map={data} setData={setData} errors={errors} />

                            <div className="overflow-hidden rounded-lg border">
                                <MapDrawEditor map={map} data={data} setData={setData} />
                            </div>

                            <div className="flex justify-center">
                                <Button variant="default">{t('maps.edit.save')}</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
