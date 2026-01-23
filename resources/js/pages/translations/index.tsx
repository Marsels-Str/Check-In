import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, Language, TranslationRow } from '@/types';
import TranslationsTable from '@/components/translations/translations-table';

interface Props {
    language: Language;
    rows: TranslationRow[];
}

export default function TranslationsIndex({ language, rows }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.languages'), href: '/languages' },
        { title: t('breadcrumb.languages.translations'), href: '/languages' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${language.name} ${t('translations.index.title')}`} />

            <div className="mx-auto max-w-[1000px] space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold dark:text-white">
                        {language.name} {t('translations.index.label')}
                    </h2>

                    <Link
                        href={route('languages.index')}
                        className="rounded-md border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                        {t('translations.index.back')}
                    </Link>
                </div>

                <TranslationsTable language={language} rows={rows} />
            </div>
        </AppLayout>
    );
}
