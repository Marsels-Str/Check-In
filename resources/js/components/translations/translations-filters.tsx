import { useT } from '@/lib/t';

interface Props {
    group: string;
    setGroup: (v: string) => void;
    viewName: string;
    setViewName: (v: string) => void;
    field: string;
    setField: (v: string) => void;
    groups: string[];
    views: string[];
    fields: string[];
}

export default function TranslationFilters({ group, setGroup, viewName, setViewName, field, setField, groups, views, fields }: Props) {
    const t = useT();
    
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="rounded-md border border-border px-3 py-2 text-sm">
                <option value="">{t('translations.index.group.all')}</option>
                {groups.map((g) => (
                    <option key={g} value={g}>
                        {g}
                    </option>
                ))}
            </select>

            <select value={viewName} onChange={(e) => setViewName(e.target.value)} className="rounded-md border border-border px-3 py-2 text-sm">
                <option value="">{t('translations.index.view.all')}</option>
                {views.map((v) => (
                    <option key={v} value={v}>
                        {v}
                    </option>
                ))}
            </select>

            <select value={field} onChange={(e) => setField(e.target.value)} className="rounded-md border border-border px-3 py-2 text-sm">
                <option value="">{t('translations.index.field.all')}</option>
                {fields.map((f) => (
                    <option key={f} value={f}>
                        {f}
                    </option>
                ))}
            </select>
        </div>
    );
}
