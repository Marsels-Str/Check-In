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

export default function UserIndexCards({ users, currentUser }: Props) {
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

    return (
        <div className="space-y-3 md:hidden">
            {visibleUsers.map((user) => (
                <div
                    key={user.id}
                    className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <UserAvatar user={user} />
                        <div className="min-w-0">
                            <div className="truncate font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                            <div className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                        <div className="ml-auto">
                            <StatusBadge active={user.is_active === 1} />
                        </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                        <div className="text-gray-500 dark:text-gray-400">{t('users.index.business')}</div>
                        <div className="text-gray-800 dark:text-gray-200">
                            <BusinessName user={user} />
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">{t('users.index.role')}</div>
                        <div className="text-gray-800 dark:text-gray-200">
                            <RoleName user={user} />
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm">
                        {canAssign && (
                            <Button variant="link" className="px-0" onClick={() => assignRole(user)}>
                                {t('users.index.assign')}
                            </Button>
                        )}
                        {canShow && (
                            <Button variant="link" className="px-0" onClick={() => showUser(user)}>
                                    {t('users.index.show')}
                            </Button>
                        )}
                        {canUpdate && (
                            <Button variant="link" className="px-0" onClick={() => editUser(user)}>
                                {t('users.index.edit')}
                            </Button>
                        )}
                        {canDelete && (
                            <Button
                                variant="link"
                                onClick={() => deleteUser(user)}
                                className="px-0 text-destructive"
                            >
                                {t('users.index.delete')}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
