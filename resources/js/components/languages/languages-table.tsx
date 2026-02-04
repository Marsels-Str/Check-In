import { useT } from '@/lib/t';
import { Language } from '@/types';
import { useMemo, useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface Props {
    languages: Language[];
    originals: number;
}

export default function LanguagesTable({ languages, originals }: Props) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        const s = search.toLowerCase();
        return languages.filter((v) => v.name.toLowerCase().includes(s) || v.code.toLowerCase().includes(s));
    }, [languages, search]);

    const syncLanguage = (language: Language) => {
        router.post(route('languages.sync', language.id));
    };

    const translationsIndex = (language: Language) => {
        router.get(route('translations.index', language.id))
    }

    const editLanguage = (language: Language) => {
        router.get(route('languages.edit', language.id))
    }

    const deleteLanguage = (language: Language) => {
        router.delete(route('languages.destroy', language.id));
    };

    const t = useT();

    return (
        <div className="space-y-2">
            <div className="max-w-md">
                <Label htmlFor="language-search">{t('languages.index.search')}</Label>
                <Input id="language-search" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            <div className="overflow-hidden rounded-lg shadow-sm bg-white border dark:bg-background">
                <table className="min-w-full divide-y">
                    <thead className="bg-muted">
                        <tr className="text-left">
                            <th className="px-4 py-2 dark:text-white">{t('languages.index.name')}</th>
                            <th className="px-4 py-2 dark:text-white">{t('languages.index.code')}</th>
                            <th className="px-4 py-2 text-right dark:text-white">{t('languages.index.actions')}</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y">
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground italic">
                                    {t('languages.index.empty')}
                                </td>
                            </tr>
                        )}

                        {filtered.map((language) => (
                            <tr key={language.id} className="hover:bg-muted">
                                <td className="px-4 py-2 dark:text-white">
                                    <Button variant="link" className="px-0" onClick={() => translationsIndex(language)}>
                                        {language.name}
                                    </Button>
                                </td>

                                <td className="px-4 py-2 text-muted-foreground">{language.code}</td>

                                <td className="px-4 py-2 text-right space-x-2">
                                    {originals - language.translated_count > 0 && language.code !== 'en' && (
                                        <Button variant="link" className="px-0 text-blue-700 dark:text-blue-500" onClick={() => syncLanguage(language)}>
                                            {t('languages.index.sync')}
                                        </Button>
                                    )}

                                    <Button variant="link" className="px-0 text-yellow-700 dark:text-yellow-300" onClick={() => editLanguage(language)}>
                                        {t('languages.index.edit')}
                                    </Button>

                                    <Button variant="link" className="px-0 text-red-700 dark:text-red-500" onClick={() => deleteLanguage(language)}>
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
