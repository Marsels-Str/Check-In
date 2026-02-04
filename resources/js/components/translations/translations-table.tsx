import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Language, TranslationRow } from '@/types';
import TranslationFilters from './translations-filters';

interface Props {
    language: Language;
    rows: TranslationRow[];
}

export default function TranslationsTable({ language, rows }: Props) {
    const [search, setSearch] = useState('');
    const [group, setGroup] = useState('');
    const [viewName, setViewName] = useState('');
    const [field, setField] = useState('');
    const [pageSize, setPageSize] = useState(20);

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

    const editTranslation = (row: TranslationRow) => {
        router.get(route('translations.edit', [language.id, row.id]));
    };

    const t = useT();

    const loadMore = () => setPageSize((prev) => prev + 20);

    return (
        <div className="w-full space-y-4">
            <div className="sticky top-0 z-20 space-y-2 rounded-md border bg-white dark:bg-background p-2 shadow-xl">
                <Input
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('translations.index.search')}
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

            {/* Mobīlais skats */}
            <div className="space-y-2 sm:hidden">
                {filtered.slice(0, pageSize).map((row) => (
                    <div key={row.id} className="rounded-md border border-border bg-background p-2 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-muted-foreground">{row.key}</span>
                            <Button variant="link" className="text-yellow-700 dark:text-yellow-300" onClick={() => editTranslation(row)}>
                                {t('translations.index.edit')}
                            </Button>
                        </div>
                        <div>
                            <p>
                                <span className="font-bold">{t('translations.index.original')}:</span> {row.original}
                            </p>
                            <p>
                                <span className="font-bold">{t('translations.index.translation')}:</span> {row.translation ?? '—'}
                            </p>
                        </div>
                    </div>
                ))}

                {pageSize < filtered.length && (
                    <div className="flex justify-center">
                        <Button onClick={loadMore}>{t('translations.index.more')}</Button>
                    </div>
                )}
            </div>

            {/* Datora skats */}
            <div className="overflow-x-auto rounded-lg border border-border">
                <table className="min-w-full">
                    <thead className="bg-muted">
                        <tr>
                            <th className="px-4 py-2 text-left">{t('translations.index.key')}</th>
                            <th className="px-4 py-2 text-left">{t('translations.index.original')}</th>
                            <th className="px-4 py-2 text-left">{t('translations.index.translation')}</th>
                            <th className="px-4 py-2 text-right">{t('translations.index.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-4 text-center text-muted-foreground italic">
                                    {t('translations.index.empty')}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((row) => (
                                <tr key={row.id} className="hover:bg-muted">
                                    <td className="px-4 py-2 font-mono text-xs whitespace-nowrap">{row.key}</td>
                                    <td className="px-4 py-2">{row.original}</td>
                                    <td className="px-4 py-2">{row.translation ?? '—'}</td>
                                    <td className="px-4 py-2 text-right">
                                        <Button variant="link" className="px-0 text-yellow-700 dark:text-yellow-300" onClick={() => editTranslation(row)}>
                                            {t('translations.index.edit')}
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
