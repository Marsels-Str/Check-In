import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { Role, BusinessProfile } from '@/types';
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
        <div className="space-y-2 md:hidden">
            {roles.map((role) => (
                <div
                    key={role.id}
                    className="rounded-lg border bg-background p-2 shadow-md"
                >
                    <div className="flex justify-between">
                        <div>
                            <div className="dark:text-white">{t('roles.index.id')}: {role.id}</div>
                            <div className="dark:text-white">{role.name}</div>
                            {canAccess && (
                                <div className="text-xs text-muted-foreground">
                                    {role.business_id ? businesses.find(b => b.id === role.business_id)?.name : 'Global'}
                                </div>
                            )}
                        </div>

                        <div className="space-x-2">
                            {canShow && (
                                <Button variant="link" className="px-0 text-blue-700 dark:text-blue-500" onClick={() => showRole(role)}>
                                    {t('roles.index.show')}
                                </Button>
                            )}
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
                    </div>
                </div>
            ))}
        </div>
    );
}
