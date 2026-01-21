import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { Button } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';

export default function RolesDesktopView({ roles }: { roles: any[] }) {
    const canEdit = useCan('roles.update');
    const canDelete = useCan('roles.delete');
    const canShow = useCan('roles.show');

    const t = useT();

    return (
        <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-transparent">
                    <tr>
                        <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('roles.index.id')}</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('roles.index.name')}</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('roles.index.permissions')}</th>
                        <th className="py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">{t('roles.index.actions')}</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {roles.map((role) => (
                        <tr key={role.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                            <td className="py-4 pr-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200">{role.id}</td>
                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{role.name}</td>
                            <td className="px-3 py-4 text-sm">
                                {canShow && (
                                    <Link
                                        href={route('roles.show', role.id)}
                                        className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                    >
                                        {t('roles.index.show')}
                                    </Link>
                                )}
                            </td>
                            <td className="py-4 pr-6 pl-3 text-right text-sm">
                                <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                    {canEdit && (
                                        <Link href={route('roles.edit', role.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                            {t('roles.index.edit')}
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <Button
                                            onClick={() => router.delete(`/roles/${role.id}`)}
                                            className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                        >
                                            {t('roles.index.delete')}
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
