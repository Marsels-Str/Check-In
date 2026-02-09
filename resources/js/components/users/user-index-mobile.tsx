import { useT } from '@/lib/t';
import { User } from '@/types';
import { useCan } from '@/lib/can';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import RoleName from '@/components/users/tiny-ui/role-name';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';
import StatusBadge from '@/components/users/tiny-ui/status-badge';
import BusinessName from '@/components/users/tiny-ui/business-name';

interface Props {
    users: User[];
    currentUser: User;
}

export default function UserMobileView({ users, currentUser }: Props) {
    const canAssign = useCan('roles.assign');
    const canUpdate = useCan('users.update');
    const canDelete = useCan('users.delete');
    const canShow = useCan('users.show');

    const t = useT();

    const visibleUsers = users.filter((user) => user.id !== currentUser.id);

    const assignRole = (user: User) => {
        router.get(route('users.roles.assign', user.id));
    };
    
    const showUser = (user: User) => {
        router.get(route('users.show', user.id));
    };

    const editUser = (user: User) => {
        router.get(route('users.edit', user.id));
    };

    const deleteUser = (user: User) => {
        router.delete(route('users.destroy', user.id));
    };

    if (!visibleUsers.length) {
        return <div className="rounded-xl border px-4 py-2 text-center text-muted-foreground italic md:hidden">{t('users.index.empty')}</div>;
    }

    return (
        <div className="space-y-3 md:hidden">
            {visibleUsers.map((user) => (
                <div
                    key={user.id}
                    className="rounded-lg border bg-background p-2 shadow-xl"
                >
                    <div className="flex items-center gap-2">
                        <UserAvatar user={user} />
                        <div>
                            <div className="truncate dark:text-white">{user.name}</div>
                            <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                        </div>
                        <div>
                            <StatusBadge active={user.is_clocked_in} viewer={currentUser} target={user} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 p-2">
                        <div className="dark:text-white">{t('users.index.business')}</div>
                            <div className="text-muted-foreground text-sm">
                                <BusinessName user={user} />
                            </div>
                            
                            <div className="dark:text-white">{t('users.index.role')}</div>
                            <div className="text-muted-foreground text-sm">
                                <RoleName user={user} />
                            </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        {canAssign && (
                            <Button variant="link" className="px-0" onClick={() => assignRole(user)}>
                                {t('users.index.assign')}
                            </Button>
                        )}
                        {canShow && (
                            <Button variant="link" className="px-0 text-blue-700 dark:text-blue-500" onClick={() => showUser(user)}>
                                    {t('users.index.show')}
                            </Button>
                        )}
                        {canUpdate && (
                            <Button variant="link" className="px-0 text-yellow-700 dark:text-yellow-500" onClick={() => editUser(user)}>
                                {t('users.index.edit')}
                            </Button>
                        )}
                        {canDelete && (
                            <Button variant="link" onClick={() => deleteUser(user)} className="px-0 text-red-700 dark:text-red-500">
                                {t('users.index.delete')}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
