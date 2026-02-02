import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ groups }: { groups: any[] }) {
    const canCreate = useCan('groups.create');
    const canUpdate = useCan('groups.update');
    const canDelete = useCan('groups.delete');
    const canShow = useCan('groups.show');
    const canAccess = useCan('business.access');

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('breadcrumb.groups'), href: '/groups' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('groups.index.title')} />
            <meta name="description" content="Manage your groups, create and manage groups" />

            <div className="px-4">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('groups.index.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('groups.index.text')}</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('groups.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('groups.index.create')}
                        </Link>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 max-h-[340px] overflow-y-auto md:max-h-[230px]">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="sticky top-0 z-10 bg-gray-50 backdrop-blur-sm dark:bg-[#0f0f0f]/95">
                                <tr>
                                    <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('groups.index.id')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('groups.index.name')}</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('groups.index.description')}</th>
                                    {canAccess && <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('groups.index.business')}</th>}
                                    <th className="py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">{t('groups.index.actions')}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <tr key={group.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="py-4 pr-3 pl-6 text-sm text-gray-900 dark:text-gray-200">{group.id}</td>
                                            <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-200">{group.name}</td>
                                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{group.description || '—'}</td>
                                            {canAccess && <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{group.business.name}</td>}
                                            <td className="py-4 pr-6 pl-3 text-right text-sm">
                                                <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                                    {canShow && (
                                                        <Link
                                                            href={route('groups.show', group.id)}
                                                            className="hover:text-green-600 dark:hover:text-green-300"
                                                        >
                                                            {t('groups.index.show')}
                                                        </Link>
                                                    )}

                                                    {canUpdate && (
                                                        <Link
                                                            href={route('groups.edit', group.id)}
                                                            className="hover:text-green-600 dark:hover:text-green-300"
                                                        >
                                                            {t('groups.index.edit')}
                                                        </Link>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            onClick={() => router.delete(`/groups/${group.id}`)}
                                                            className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                                        >
                                                            {t('groups.index.delete')}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {t('groups.index.empty')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
