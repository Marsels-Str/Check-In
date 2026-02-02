import { useT } from '@/lib/t';
import { Language } from '@/types';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
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
            href: '/languages'
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('languages.index.title')} />
            <meta name="description" content="Manage application languages and translations" />

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">{t('languages.index.label')}</h2>

                <Link
                    href={route('languages.create')}
                    className="inline-flex items-center rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                >
                    {t('languages.index.add')}
                </Link>
            </div>

            <LanguagesTable languages={languages} originals={originals} />
        </AppLayout>
    );
}
