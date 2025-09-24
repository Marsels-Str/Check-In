import { type BreadcrumbItem, User } from '@/types';
import { Link, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

export default function Index({ users, currentUser }: { users: User[], currentUser: User }) {

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(route('users.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div>
                {can('users.create') &&
                    <Link
                        href={route('users.create')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Create
                    </Link>
                }
            </div>

            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Users</h1>
            <table>

                <thead>
                    <tr>
                        <th className="border-b border-gray-400 text-xs py-2 text-gray-500 uppercase dark:text-gray-400">
                            ID
                        </th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">
                            Name
                        </th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">
                            Email
                        </th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">
                            Roles
                        </th>
                        <th className="border-b border-gray-400 text-xs text-gray-500 uppercase dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {users
                    .filter((user: User) => user.id !== currentUser.id)
                    .map((user: User) => 
                    <tr className='text-center'>
                        <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">
                            { user.id }
                        </td>
                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                            { user.name }
                        </td>
                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                            { user.email }
                        </td>
                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                            {Array.isArray(user.roles) && user.roles?
                             user.roles.map((role: any) => role.name).join(', '): ''}
                        </td>

                        <td className="border-b border-gray-400">
                            {can('roles.assign') &&
                            <Link
                                href={route('users.roles.assign', user.id)}
                                className="text-yellow-500 hover:text-yellow-700 mr-2">
                                Assign
                            </Link>
                            }

                            <Link
                                href={route('users.show', user.id)}
                                className="text-gray-500 hover:text-gray-700 mr-2">
                                Show
                            </Link>

                            {can('users.edit') &&
                                <Link
                                    href={route('users.edit', user.id)}
                                    className="text-blue-500 hover:text-blue-700 mr-2">
                                    Edit
                                </Link>
                            }
                            {can('users.delete') &&
                                <Link
                                    onClick={() => handleDelete(user.id)}
                                    className="text-red-500 hover:text-red-700">
                                    Delete
                                </Link>
                            }
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </AppLayout>
    );
}
