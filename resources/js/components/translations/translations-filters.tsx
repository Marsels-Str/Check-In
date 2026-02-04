import { useT } from '@/lib/t';
import type { TranslationFilters } from '@/types';

export default function TranslationFilters({ group, setGroup, viewName, setViewName, field, setField, groups, views, fields }: TranslationFilters) {
    const t = useT();

    return (
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full rounded-md border dark:border-white px-2 py-2">
                <option className="border dark:bg-black" value="">{t('translations.index.group.all')}</option>
                {groups.map((g) => (
                    <option className="dark:bg-black" key={g} value={g}>
                        {g}
                    </option>
                ))}
            </select>

            <select value={viewName} onChange={(e) => setViewName(e.target.value)} className="w-full rounded-md border dark:border-white px-2 py-2"
            >
                <option className="dark:bg-black" value="">{t('translations.index.view.all')}</option>
                {views.map((v) => (
                    <option className="dark:bg-black" key={v} value={v}>
                        {v}
                    </option>
                ))}
            </select>

            <select value={field} onChange={(e) => setField(e.target.value)} className="w-full rounded-md border dark:border-white px-2 py-2">
                <option className="dark:bg-black" value="">{t('translations.index.field.all')}</option>
                {fields.map((f) => (
                    <option className="dark:bg-black" key={f} value={f}>
                        {f}
                    </option>
                ))}
            </select>
        </div>
    );
}
