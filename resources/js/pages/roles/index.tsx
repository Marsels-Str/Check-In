import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
];

export default function Index({ roles }: { roles: any[] }) {
    const canCreate = useCan('roles.create');
    const canEdit = useCan('roles.edit');
    const canDelete = useCan('roles.delete');

    function handleDelete(roleId: number) {
        if (confirm('Are you sure you want to delete this role?')) {
            router.delete(route('roles.destroy', roleId));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles" />

            <div>
                {canCreate && (
                    <Link
                        href={route('roles.create')}
                        className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Create
                    </Link>
                )}
            </div>

            <h1 className="text-3xl leading-tight font-bold md:text-5xl">Roles</h1>
            <table className="mt-4 w-full table-auto">
                <thead>
                    <tr className="text-xs uppercase">
                        <th className="border-b border-gray-400 py-2 text-gray-500 dark:text-gray-400">ID</th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">Name</th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">Permissions</th>
                        <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {roles.map(({ id, name }) => (
                        <tr key={id} className="text-center">
                            <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">{id}</td>

                            <td className="border-b border-gray-400 text-gray-900 dark:text-white">{name}</td>

                            <td className="border-b border-gray-400">
                                <Link href={route('roles.show', id)} className="mr-4 text-yellow-500 hover:text-yellow-700">
                                    Show
                                </Link>
                            </td>

                            <td className="border-b border-gray-400">
                                {canEdit && (
                                    <Link href={route('roles.edit', id)} className="text-blue-500 hover:text-blue-700">
                                        Edit
                                    </Link>
                                )}

                                {canDelete && (
                                    <button onClick={() => handleDelete(id)} className="ml-4 text-red-500 hover:text-red-700 focus:outline-none">
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AppLayout>
    );
}
