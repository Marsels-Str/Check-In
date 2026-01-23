import { useT } from '@/lib/t';
import { Role } from '@/types';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    roles: Role[];
}

export default function RolesDesktopView({ roles }: Props) {
    const canEdit = useCan('roles.update');
    const canDelete = useCan('roles.delete');
    const canShow = useCan('roles.show');

    const t = useT();

    const showRole = (role: Role) => {
        router.get(route('roles.show', role.id));
    };

    const editRole = (role: Role) => {
        router.get(route('roles.edit', role.id));
    };

    const deleteRole = (role: Role) => {
        router.delete(route('roles.destroy', role.id));
    };

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
                                    <Button variant="link" className="px-0" onClick={() => showRole(role)}>
                                        {t('roles.index.show')}
                                    </Button>
                                )}
                            </td>
                            <td className="py-4 pr-6 pl-3 text-right text-sm">
                                <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                    {canEdit && (
                                        <Button variant="link" className="px-0" onClick={() => editRole(role)}>
                                            {t('roles.index.edit')}
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button variant="link" className="px-0 text-destructive" onClick={() => deleteRole(role)}>
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
