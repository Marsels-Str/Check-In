import { useT } from '@/lib/t';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

type Language = {
    id: number;
    name: string;
    code: string;
    translated_count: number;
};

interface Props {
    languages: Language[];
    originals: number;
    lastBatch?: string | null;
}

export default function LanguagesTable({ languages, originals, lastBatch }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return languages.filter((v) => v.name.toLowerCase().includes(s) || v.code.toLowerCase().includes(s));
    }, [languages, search]);

    const t = useT();

    return (
        <div className="mt-6 space-y-4">
            <div className="max-w-md space-y-1">
                <Label htmlFor="language-search">{t('languages.index.search')}</Label>

                <Input id="language-search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr className="text-left text-muted-foreground">
                            <th className="px-4 py-2 font-medium">{t('languages.index.name')}</th>
                            <th className="px-4 py-2 font-medium">{t('languages.index.code')}</th>
                            <th className="px-4 py-2 text-right font-medium">{t('languages.index.actions')}</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-6 text-center text-muted-foreground italic">
                                    {t('languages.index.empty')}
                                </td>
                            </tr>
                        )}

                        {filtered.map((language) => (
                            <tr key={language.id} className="transition hover:bg-muted/30">
                                <td className="px-4 py-2 font-medium">
                                    <Link href={`/languages/${language.id}/translations`} className="hover:underline">
                                        {language.name}
                                    </Link>
                                </td>

                                <td className="px-4 py-2 text-muted-foreground">{language.code}</td>

                                <td className="space-x-2 px-4 py-2 text-right">
                                    {originals - language.translated_count > 0 && language.code !== 'en' && (
                                        <Button variant="link" className="px-0" onClick={() => router.post(`/languages/${language.id}/sync`)}>
                                            {t('languages.index.sync')}
                                        </Button>
                                    )}

                                    <Link href={`/languages/${language.id}/edit`}>{t('languages.index.edit')}</Link>

                                    <Button variant="link" className="px-0 text-destructive" onClick={() => router.delete(`/languages/${language.id}`)}>
                                        {t('languages.index.delete')}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
