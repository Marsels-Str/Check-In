import { User } from '@/types';
import { useCan } from '@/lib/can';
import { Button } from '@headlessui/react';
import { Link, router } from '@inertiajs/react';
import RoleName from '@/components/users/tiny-ui/role-name';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';
import StatusBadge from '@/components/users/tiny-ui/status-badge';
import BusinessName from '@/components/users/tiny-ui/business-name';

export default function UserIndexCards({
    users,
    currentUser,
}: {
    users: User[];
    currentUser: User;
}) {
    const canAssign = useCan('roles.assign');
    const canEdit = useCan('users.edit');
    const canDelete = useCan('users.delete');

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    }

    const visibleUsers = users.filter((user) => user.id !== currentUser.id);

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
                        <div className="text-gray-500 dark:text-gray-400">Business</div>
                        <div className="text-gray-800 dark:text-gray-200"><BusinessName user={user} /></div>
                        <div className="text-gray-500 dark:text-gray-400">Role</div>
                        <div className="text-gray-800 dark:text-gray-200"><RoleName user={user} /></div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-end gap-3 text-sm">
                        {canAssign && (
                            <Link
                                href={route('users.roles.assign', user.id)}
                                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                            >
                                Assign
                            </Link>
                        )}
                        <Link
                            href={route('users.show', user.id)}
                            className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                        >
                            Show
                        </Link>
                        {canEdit && (
                            <Link
                                href={route('users.edit', user.id)}
                                className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                            >
                                Edit
                            </Link>
                        )}
                        {canDelete && (
                            <Button
                                onClick={() => handleDelete(user.id)}
                                className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                            >
                                Delete
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
