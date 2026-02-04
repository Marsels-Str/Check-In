import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
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

    const translationsBack = () => {
        router.get(route('languages.index'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${language.name} ${t('translations.index.title')}`} />
            <meta name="description" content="Manage translations for the selected language" />

            <div className="mx-auto max-w-full p-2 space-y-2">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold dark:text-white">
                        {language.name} {t('translations.index.label')}
                    </h2>

                    <Button variant="outline" onClick={() => translationsBack()}>
                        {t('translations.index.back')}
                    </Button>
                </div>

                <div className="overflow-x">
                    <TranslationsTable language={language} rows={rows} />
                </div>
            </div>
        </AppLayout>
    );
}
