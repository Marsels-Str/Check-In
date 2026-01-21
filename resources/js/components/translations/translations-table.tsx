import { useT } from '@/lib/t';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import TranslationFilters from './translations-filters';

type Language = {
    id: number;
    name: string;
};

type TranslationRow = {
    id: number;
    key: string;
    original: string;
    translation: string | null;
    group: string;
    view: string;
    field: string;
};

interface Props {
    language: Language;
    rows: TranslationRow[];
}

export default function TranslationsTable({ language, rows }: Props) {
    const [search, setSearch] = useState('');
    const [group, setGroup] = useState('');
    const [viewName, setViewName] = useState('');
    const [field, setField] = useState('');

    const groups = useMemo(() => Array.from(new Set(rows.map((r) => r.group).filter(Boolean))).sort(), [rows]);

    const views = useMemo(
        () =>
            Array.from(
                new Set(
                    rows
                        .filter((r) => !group || r.group === group)
                        .map((r) => r.view)
                        .filter(Boolean),
                ),
            ).sort(),
        [rows, group],
    );

    const fields = useMemo(
        () =>
            Array.from(
                new Set(
                    rows
                        .filter((r) => (!group || r.group === group) && (!viewName || r.view === viewName))
                        .map((r) => r.field)
                        .filter(Boolean),
                ),
            ).sort(),
        [rows, group, viewName],
    );

    const filtered = useMemo(() => {
        const s = search.toLowerCase();

        return rows.filter((r) => {
            if (group && r.group !== group) return false;
            if (viewName && r.view !== viewName) return false;
            if (field && r.field !== field) return false;

            if (!s) return true;

            return r.key.toLowerCase().includes(s) || r.original.toLowerCase().includes(s) || (r.translation ?? '').toLowerCase().includes(s);
        });
    }, [rows, search, group, viewName, field]);

    const t = useT();

    return (
        <div className="space-y-4">
            <div className="sticky top-0 z-20 space-y-3 rounded-lg border border-border bg-background p-4 shadow-sm">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={`${t('translations.index.search')}`}
                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                />

                <TranslationFilters
                    group={group}
                    setGroup={setGroup}
                    viewName={viewName}
                    setViewName={setViewName}
                    field={field}
                    setField={setField}
                    groups={groups}
                    views={views}
                    fields={fields}
                />
            </div>

            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="px-4 py-2 text-left">{t('translations.index.key')}</th>
                            <th className="px-4 py-2 text-left">{t('translations.index.original')}</th>
                            <th className="px-4 py-2 text-left">{t('translations.index.translation')}</th>
                            <th className="px-4 py-2 text-right">{t('translations.index.actions')}</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground italic">
                                    {t('translations.index.empty')}
                                </td>
                            </tr>
                        )}

                        {filtered.map((row) => (
                            <tr key={row.id} className="hover:bg-muted/30">
                                <td className="px-4 py-2 font-mono text-xs">{row.key}</td>
                                <td className="px-4 py-2">{row.original}</td>
                                <td className="px-4 py-2">{row.translation ?? '—'}</td>
                                <td className="px-4 py-2 text-right">
                                    <Link href={route('translations.edit', [language.id, row.id])} className="text-primary hover:underline">
                                        {t('translations.index.edit')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
