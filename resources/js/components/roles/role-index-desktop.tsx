import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { Role, BusinessProfile } from '@/types';
import { Button } from '@/components/ui/button';

interface Props {
    roles: Role[];
    businesses: BusinessProfile[];
}

export default function RolesDesktopView({ roles, businesses }: Props) {
    const canEdit = useCan('roles.update');
    const canDelete = useCan('roles.delete');
    const canShow = useCan('roles.show');
    const canAccess = useCan('business.access');

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
        <div className="hidden overflow-hidden rounded-lg border bg-background shadow-xl md:block">
            <table className="min-w-full divide-y">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('roles.index.id')}</th>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('roles.index.name')}</th>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('roles.index.permissions')}</th>
                        {canAccess && <th className="px-4 py-2 text-left font-bold dark:text-white">{t('roles.index.business')}</th>}
                        <th className="px-4 py-2 text-right font-bold dark:text-white">{t('roles.index.actions')}</th>
                    </tr>
                </thead>

                <tbody className="divide-y">
                    {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-muted">
                            <td className="px-4 py-2 dark:text-white">{role.id}</td>
                            <td className="px-4 py-2 dark:text-white">{role.name}</td>
                            <td className="px-4 py-2">
                                {canShow && (
                                    <Button variant="link" className="px-0 text-blue-700 dark:text-blue-500" onClick={() => showRole(role)}>
                                        {t('roles.index.show')}
                                    </Button>
                                )}
                            </td>
                            {canAccess && (
                                <td className="px-4 py-2 dark:text-white">
                                    {role.business_id ? businesses.find(b => b.id === role.business_id)?.name : 'Global'}
                                </td>
                            )}
                            <td className="px-4 py-2 text-right">
                                <div className="flex justify-end space-x-2 dark:text-white">
                                    {canEdit && (
                                        <Button variant="link" className="px-0 text-yellow-700 dark:text-yellow-500" onClick={() => editRole(role)}>
                                            {t('roles.index.edit')}
                                        </Button>
                                    )}
                                    {canDelete && (
                                        <Button variant="link" className="px-0 text-red-700 dark:text-red-500" onClick={() => deleteRole(role)}>
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
