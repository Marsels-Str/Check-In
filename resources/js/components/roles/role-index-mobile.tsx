import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { Button } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';

export default function RolesMobileView({ roles }: { roles: any[] }) {
    const canEdit = useCan('roles.update');
    const canDelete = useCan('roles.delete');
    const canShow = useCan('roles.show');

    const t = useT();

    return (
        <div className="space-y-3 md:hidden">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{role.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{t('roles.index.id')}: {role.id}</div>
                        </div>

                        <div className="flex gap-3 text-sm">
                            {canShow && (
                                <Link
                                    href={route('roles.show', role.id)}
                                    className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                >
                                    {t('roles.index.show')}
                                </Link>
                            )}
                            {canEdit && (
                                <Link
                                    href={route('roles.edit', role.id)}
                                    className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                >
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
                    </div>
                </div>
            ))}
        </div>
    );
}
