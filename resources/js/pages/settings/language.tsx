import { useT } from '@/lib/t';
import { useMemo, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem, Language } from '@/types';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router, usePage } from '@inertiajs/react';

export default function LanguageSettings() {
    const { props } = usePage<{
        languages: Language[];
        language: string;
    }>();

    const [search, setSearch] = useState('');

    const defaultLanguage: Language = {
        id: 0,
        name: 'English',
        code: 'en',
        translated_count: 0,
    };

    const allLanguages = useMemo(() => {
        return [defaultLanguage, ...props.languages];
    }, [props.languages]);

    const filtered = useMemo(() => {
        const s = search.toLowerCase();

        return allLanguages.filter((l) => l.name.toLowerCase().includes(s) || l.code.toLowerCase().includes(s));
    }, [allLanguages, search]);

    const switchLanguage = (code: string) => {
        if (code === props.language) return;

        router.post(
            route('language.change'),
            { language: code },
            {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => router.reload(),
            },
        );
    };

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.language'),
            href: '/settings/language',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.language.title')} />
            <meta name="description" content="Manage your language settings" />

            <SettingsLayout>
                <div className="space-y-2 rounded-xl border bg-background p-2 shadow-xl">
                    <HeadingSmall title={t('settings.language.small.title')} description={t('settings.language.small.description')} />

                    <Label>{t('settings.language.search')}</Label>
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} />

                    <div className="divide-y overflow-hidden rounded-lg border">
                        {filtered.length === 0 && (
                            <div className="px-4 py-2 text-center text-muted-foreground italic">{t('settings.language.empty')}</div>
                        )}

                        {filtered.map((lang) => {
                            const active = lang.code === props.language;

                            return (
                                <button
                                    key={lang.code}
                                    onClick={() => switchLanguage(lang.code)}
                                    className={`flex w-full justify-between px-4 py-2 text-left ${active ? 'bg-muted' : 'hover:bg-muted'}`}
                                >
                                    <div>
                                        <div className="font-medium">
                                            {lang.name}
                                            {lang.code === 'en' && (
                                                <span className="ml-2 text-muted-foreground">{t('settings.language.default')}</span>
                                            )}
                                        </div>
                                        <div className="text-muted-foreground">{lang.code.toUpperCase()}</div>
                                    </div>

                                    {active && <span className="font-bold">{t('settings.language.active')}</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
