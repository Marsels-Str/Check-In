import { useT } from '@/lib/t';
import { EditableMap } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
    map: EditableMap;
    setData: (key: keyof EditableMap, value: any) => void;
    errors?: Partial<Record<keyof EditableMap, string>>;
}

export default function MapEditorInputs({ map, setData, errors = {} }: Props) {
    const t = useT();

    return (
        <div className="space-y-4">
            {map.type === 'marker' && (
                <>
                    <MapInput label={t('maps.edit.lat')} value={map.lat} onChange={(v) => setData('lat', v)} error={errors?.lat} />
                    <MapInput label={t('maps.edit.lng')} value={map.lng} onChange={(v) => setData('lng', v)} error={errors?.lng} />
                </>
            )}

            {map.type === 'circle' && (
                <>
                    <MapInput label={t('maps.edit.lat')} value={map.lat} onChange={(v) => setData('lat', v)} error={errors?.lat} />
                    <MapInput label={t('maps.edit.lng')} value={map.lng} onChange={(v) => setData('lng', v)} error={errors?.lng} />
                    <MapInput label={t('maps.edit.radius')} value={map.radius} onChange={(v) => setData('radius', v)} error={errors?.radius} />
                </>
            )}

            {map.type === 'polygon' && (
                <div>
                    <Label>{t('maps.edit.polygon')}</Label>
                    <textarea
                        value={map.polygon}
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
