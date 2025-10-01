import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div>
                {canCreate && (
                    <Link
                        href={route('users.create')}
                        className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Create
                    </Link>
                )}
            </div>

            <h1 className="text-3xl leading-tight font-bold md:text-5xl">Users</h1>
            <table>
                <thead>
                    <tr>
                        <th className="border-b border-gray-400 py-2 text-xs text-gray-500 uppercase">Id</th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase">Name</th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase">Email</th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase">Roles</th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users
                        .filter((user: User) => user.id !== currentUser.id)
                        .map((user: User) => (
                            <tr className="text-center">
                                <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">{user.id}</td>
                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">{user.name}</td>
                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">{user.email}</td>
                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    {Array.isArray(user.roles) && user.roles ? user.roles.map((role: any) => role.name).join(', ') : ''}
                                </td>

                                <td className="border-b border-gray-400">
                                    {canAssign && (
                                        <Link href={route('users.roles.assign', user.id)} className="mr-2 text-yellow-500 hover:text-yellow-700">
                                            Assign
                                        </Link>
                                    )}

                                    <Link href={route('users.show', user.id)} className="mr-2 text-gray-500 hover:text-gray-700">
                                        Show
                                    </Link>

                                    {canEdit && (
                                        <Link href={route('users.edit', user.id)} className="mr-2 text-blue-500 hover:text-blue-700">
                                            Edit
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <Link onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                                            Delete
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
