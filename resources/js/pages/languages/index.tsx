import { useT } from '@/lib/t';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, Language } from '@/types';
import AppLayout from '@/layouts/app-layout';
import LanguagesTable from '@/components/languages/languages-table';

interface Props {
    languages: Language[];
    originals: number;
}

export default function LanguagesIndex({ languages, originals }: Props) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.languages'),
            href: '/languages',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.index.title')} />
            <meta name="description" content="Manage application languages and translations" />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold dark:text-white">{t('languages.index.label')}</h2>

                    <div className="mt-2">
                        <Link
                            href={route('languages.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('languages.index.add')}
                        </Link>
                    </div>
                </div>

                <LanguagesTable languages={languages} originals={originals} />
            </div>
        </AppLayout>
    );
}
