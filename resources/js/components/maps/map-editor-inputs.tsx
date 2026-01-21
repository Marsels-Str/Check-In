import { useT } from '@/lib/t';
import type { EditableMap } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function MapEditorInputs({
    data,
    setData,
    errors = {},
}: {
    data: EditableMap;
    setData: (key: keyof EditableMap, value: any) => void;
    errors?: Partial<Record<keyof EditableMap, string>>;
}) {
    const t = useT();

    return (
        <div className="space-y-4">
            {data.type === 'marker' && (
                <>
                    <MapInput label={t('maps.edit.lat')} value={data.lat} onChange={(v) => setData('lat', v)} error={errors?.lat} />
                    <MapInput label={t('maps.edit.lng')} value={data.lng} onChange={(v) => setData('lng', v)} error={errors?.lng} />
                </>
            )}

            {data.type === 'circle' && (
                <>
                    <MapInput label={t('maps.edit.lat')} value={data.lat} onChange={(v) => setData('lat', v)} error={errors?.lat} />
                    <MapInput label={t('maps.edit.lng')} value={data.lng} onChange={(v) => setData('lng', v)} error={errors?.lng} />
                    <MapInput label={t('maps.edit.radius')} value={data.radius} onChange={(v) => setData('radius', v)} error={errors?.radius} />
                </>
            )}

            {data.type === 'polygon' && (
                <div>
                    <Label>{t('maps.edit.polygon')}</Label>
                    <textarea
                        value={data.polygon}
                        onChange={(e) => setData('polygon', e.target.value)}
                        className="mt-1 w-full rounded-md border p-2"
                        rows={3}
                    />
                    {errors.polygon && <div className="text-sm text-red-500">{errors.polygon}</div>}
                </div>
            )}
        </div>
    );
}

function MapInput({ label, value, onChange, error }: { label: string; value: any; onChange: (v: string) => void; error?: string }) {
    return (
        <div>
            <Label>{label}</Label>
            <Input step="any" value={value ?? ''} onChange={(e) => onChange(e.target.value)} className="mt-1" />
            {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
    );
}
