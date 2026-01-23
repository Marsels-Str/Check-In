import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import UserCreateFields from '@/components/users/user-create-fields';

export default function Create() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.users.create'),
            href: '/users'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.create.title')} />

            <div className="px-4 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{t('users.create.label')}</h1>
                        <p className="text-sm">
                        {t('users.create.text')}
                        </p>
                    </div>

                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('users.create.back')}
                    </Link>
                </div>

                <div className="mx-auto w-full max-w-lg rounded-2xl border border p-6 shadow-sm transition-all duration-300">
                    <h2 className="mb-4 text-center text-lg font-semibold">
                        {t('users.create.info')}
                    </h2>

                    <UserCreateFields />
                </div>
            </div>
        </AppLayout>
    );
}
