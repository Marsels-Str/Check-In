import { useT } from '@/lib/t';
import { User } from '@/types';
import { useCan } from '@/lib/can';
import { Button } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import RoleName from '@/components/users/tiny-ui/role-name';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';
import StatusBadge from '@/components/users/tiny-ui/status-badge';
import BusinessName from '@/components/users/tiny-ui/business-name';

export default function UsersDesktopView({ users, currentUser }: { users: User[]; currentUser: User }) {
    const canAssign = useCan('roles.assign');
    const canUpdate = useCan('users.update');
    const canDelete = useCan('users.delete');
    const canShow = useCan('users.show');

    const t = useT();

    const visibleUsers = users.filter((user) => user.id !== currentUser.id);

    return (
        <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-transparent">
                    <tr>
                        <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('users.index.name')}</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('users.index.business')}</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('users.index.role')}</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">{t('users.index.status')}</th>
                        <th className="relative py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">{t('users.index.actions')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                    {visibleUsers.map((user) => (
                        <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                            <td className="py-4 pr-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200">
                                <div className="flex items-center gap-3">
                                    <UserAvatar user={user} />
                                    <div>
                                        <div className="font-medium">{user.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">
                                <BusinessName user={user} />
                            </td>
                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">
                                <RoleName user={user} />
                            </td>
                            <td className="px-3 py-4 text-sm">
                                <StatusBadge active={user.is_active === 1} />
                            </td>
                            <td className="relative py-4 pr-6 pl-3 text-right text-sm">
                                <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                    {canAssign && (
                                        <Link href={route('users.roles.assign', user.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                            {t('users.index.assign')}
                                        </Link>
                                    )}
                                    {canShow && (
                                        <Link href={route('users.show', user.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                            {t('users.index.show')}
                                        </Link>
                                    )}
                                    {canUpdate && (
                                        <Link href={route('users.edit', user.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                            {t('users.index.edit')}
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <Button
                                            onClick={() => router.delete(`/users/${user.id}`)}
                                            className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                        >
                                            {t('users.index.delete')}
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
