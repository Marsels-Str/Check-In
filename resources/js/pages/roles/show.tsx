import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

export default function Show({ role, permissions }: { role: any; permissions: string[] }) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.roles'), href: '/roles' },
        { title: t('breadcrumb.roles.show'), href: '/roles' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('roles.show.title')}: ${role.name}`} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('roles.show.label')}</h1>
                        <p className="text-sm text-gray-500">{t('roles.show.text')}</p>
                    </div>

                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('roles.show.back')}
                    </Link>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <div className="mb-6">
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('roles.show.name')}:</p>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">{role.name}</p>
                    </div>

                    <div>
                        <p className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('roles.show.permissions')}:</p>
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((permission, id) => (
                                <span
                                    key={id}
                                    className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-400/30 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/20"
                                >
                                    {permission}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
