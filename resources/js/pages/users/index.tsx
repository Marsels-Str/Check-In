import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

export default function Index({ users, currentUser }: { users: User[]; currentUser: User }) {
    const canCreate = useCan('users.create');
    const canAssign = useCan('roles.assign');
    const canEdit = useCan('users.edit');
    const canDelete = useCan('users.delete');

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    }

    const visibleUsers = users.filter((u) => u.id !== currentUser.id);

    const StatusBadge = ({ active }: { active: boolean }) =>
        active ? (
            <span className="inline-flex items-center rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700 ring-1 ring-yellow-400/30 ring-inset dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-500/20">
                Active
            </span>
        ) : (
            <span className="inline-flex items-center rounded-md bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-700 ring-1 ring-pink-400/30 ring-inset dark:bg-pink-800/40 dark:text-pink-400 dark:ring-pink-500/20">
                Inactive
            </span>
        );

    const avatar = (u: User) =>
        typeof u.profile?.portrait === 'string' && u.profile?.portrait ? (
            <img src={u.profile.portrait} alt={u.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-300 dark:ring-white/10" />
        ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-300">
                {u.name ? u.name.charAt(0) : '?'}
            </div>
        );

    const businessNames = (u: User) =>
        Array.isArray((u as any).businesses) && (u as any).businesses?.length
            ? (u as any).businesses.map((b: any) => b.name).join(', ')
            : 'No business';

    const roleNames = (u: User) =>
        Array.isArray((u as any).roles) && (u as any).roles?.length ? (u as any).roles.map((r: any) => r.name).join(', ') : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Users</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A list of all the users including their business and role.</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Add
                        </Link>
                    )}
                </div>

                {/* MOBILE (cards) */}
                <div className="space-y-3 md:hidden">
                    {visibleUsers.map((user) => (
                        <div
                            key={user.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                {avatar(user)}
                                <div className="min-w-0">
                                    <div className="truncate font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                    <div className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                </div>
                                <div className="ml-auto">
                                    <StatusBadge active={!!(user as any).is_clocked_in} />
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                                <div className="text-gray-500 dark:text-gray-400">Business</div>
                                <div className="text-gray-800 dark:text-gray-200">{businessNames(user)}</div>
                                <div className="text-gray-500 dark:text-gray-400">Role</div>
                                <div className="text-gray-800 dark:text-gray-200">{roleNames(user)}</div>
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

                {/* DESKTOP (table) */}
                <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-transparent">
                            <tr>
                                <th scope="col" className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Business
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Role
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="relative py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {visibleUsers.map((user) => (
                                <tr key={user.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="py-4 pr-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200">
                                        <div className="flex items-center gap-3">
                                            {avatar(user)}
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{businessNames(user)}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{roleNames(user)}</td>
                                    <td className="px-3 py-4 text-sm">
                                        <StatusBadge active={!!(user as any).is_clocked_in} />
                                    </td>
                                    <td className="relative py-4 pr-6 pl-3 text-right text-sm">
                                        <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                            {canAssign && (
                                                <Link
                                                    href={route('users.roles.assign', user.id)}
                                                    className="hover:text-green-600 dark:hover:text-green-300"
                                                >
                                                    Assign
                                                </Link>
                                            )}
                                            <Link href={route('users.show', user.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                                Show
                                            </Link>
                                            {canEdit && (
                                                <Link href={route('users.edit', user.id)} className="hover:text-green-600 dark:hover:text-green-300">
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
