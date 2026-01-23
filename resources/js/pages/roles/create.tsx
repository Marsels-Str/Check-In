import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import RoleCreateFields from '@/components/roles/roles-create-fields';

interface Props {
    permissions: string[];
    businesses: any[];
    auth: any;
}

export default function Create({ permissions, businesses, auth }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.roles'), href: '/roles' },
        { title: t('breadcrumb.roles.create'), href: '/roles/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('roles.create.title')} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('roles.create.label')}</h1>
                        <p className="text-sm text-gray-500">{t('roles.create.text')}</p>
                    </div>

                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('roles.create.back')}
                    </Link>
                </div>

                <RoleCreateFields permissions={permissions} businesses={businesses} auth={auth} />
            </div>
        </AppLayout>
    );
}
