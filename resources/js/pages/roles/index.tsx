import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link} from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: { roles: any[]}) {

    
    function handleDelete(roleId: number) {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', roleId));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

                <div>
                    {can('roles.create') &&
                    <Link
                        href={route('roles.create')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Create
                    </Link>
                    }
                </div>

            <h1 className="text-3xl font-bold leading-tight md:text-5xl">Roles</h1>
            <table className="mt-4 w-full table-auto">

                <thead>
                    <tr className='text-xs uppercase'>
                        <th className="border-b border-gray-400 py-2 text-gray-500 dark:text-gray-400">
                            ID
                        </th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">
                            Name
                        </th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">
                            Permissions
                        </th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                     { roles.map(({ id, name }) =>
                    <tr className='text-center'>
                        <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">
                            { id }
                        </td>

                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                            { name }
                        </td>
                        
                        <td className='border-b border-gray-400'>
                            <Link
                                href={route('roles.show', id)}
                                className="text-yellow-500 hover:text-yellow-700 mr-4">
                                Show
                            </Link>
                        </td>

                        <td className="border-b border-gray-400">
                            {can('roles.edit') &&
                                <Link
                                    href={route('roles.edit', id)}
                                    className="text-blue-500 hover:text-blue-700">
                                    Edit
                                </Link>
                            }
                            
                            {can('roles.delete') &&
                                <button
                                    onClick={() => handleDelete(id)}
                                    className="text-red-500 hover:text-red-700 ml-4 focus:outline-none">
                                    Delete
                                </button>
                            }
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </AppLayout>
    );
}
