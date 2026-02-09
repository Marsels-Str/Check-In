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

export default function UsersDesktopView({ users, currentUser }: Props) {
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
        <div className="hidden overflow-hidden rounded-lg border bg-background shadow-xl md:block">
            <table className="min-w-full divide-y">
                <thead className="bg-muted">
                    <tr>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('users.index.name')}</th>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('users.index.business')}</th>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('users.index.role')}</th>
                        <th className="px-4 py-2 text-left font-bold dark:text-white">{t('users.index.status')}</th>
                        <th className="px-4 py-2 text-right font-bold dark:text-white">{t('users.index.actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {visibleUsers.length ? (
                        visibleUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-muted">
                                <td className="px-4 py-2 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <UserAvatar user={user} />
                                        <div>
                                            <div>{user.name}</div>
                                            <div className="text-sm text-muted-foreground">{user.email}</div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-2 dark:text-white">
                                    <BusinessName user={user} />
                                </td>

                                <td className="px-4 py-2 dark:text-white">
                                    <RoleName user={user} />
                                </td>

                                <td className="px-4 py-2">
                                    <StatusBadge active={user.is_clocked_in} viewer={currentUser} target={user} />
                                </td>

                                <td className="px-4 py-2 text-right">
                                    <div className="flex justify-end space-x-2 dark:text-white">
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
                                            <Button
                                                variant="link"
                                                className="px-0 text-yellow-700 dark:text-yellow-500"
                                                onClick={() => editUser(user)}
                                            >
                                                {t('users.index.edit')}
                                            </Button>
                                        )}
                                        {canDelete && (
                                            <Button variant="link" onClick={() => deleteUser(user)} className="px-0 text-red-700 dark:text-red-500">
                                                {t('users.index.delete')}
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="px-4 py-2 text-center text-muted-foreground italic">
                                {t('users.index.empty')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
