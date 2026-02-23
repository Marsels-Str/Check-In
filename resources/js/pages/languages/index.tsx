import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, Language } from '@/types';
import LanguagesTable from '@/components/languages/languages-table';
import SyncProgress from '@/components/languages/languages-progress';

interface Props {
    languages: Language[];
    originals: number;
}

export default function LanguagesIndex({ languages, originals }: Props) {
    const t = useT();
    const activeLanguage = languages.find(l => l.translation_batch_id)

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.languages'),
            href: '/languages',
        },
    ];

    const languagesCreate = () => {
        router.get(route('languages.create'))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.index.title')} />
            <meta name="description" content="Manage application languages and translations" />

            <div className="p-2 space-y-2">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.index.label')}</h2>

                    <Button variant="default" onClick={() => languagesCreate()}>
                        {t('languages.index.add')}
                    </Button>
                </div>

                {activeLanguage && (
                    <SyncProgress
                        languageId={activeLanguage.id}
                        batchId={activeLanguage.translation_batch_id}
                    />
                )}

                <LanguagesTable languages={languages} originals={originals} />
            </div>
        </AppLayout>
    );
}
