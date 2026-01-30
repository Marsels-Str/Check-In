import { useT } from '@/lib/t';
import { Role, BusinessProfile } from '@/types';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    roles: Role[];
    businesses: BusinessProfile[];
}

export default function RolesMobileView({ roles, businesses }: Props) {
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
        <div className="space-y-3 md:hidden">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{t('roles.index.id')}: {role.id}</div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{role.name}</div>
                            {canAccess && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    {role.business_id ? businesses.find(b => b.id === role.business_id)?.name : 'Global'}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 text-sm">
                            {canShow && (
                                <Button variant="link" className="px-0" onClick={() => showRole(role)}>
                                    {t('roles.index.show')}
                                </Button>
                            )}
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
                    </div>
                </div>
            ))}
        </div>
    );
}
