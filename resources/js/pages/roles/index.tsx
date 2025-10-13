import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@headlessui/react';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

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

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Roles</h1>
                        <p className="text-sm text-gray-500">Manage system roles and their assigned permissions.</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('roles.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Create
                        </Link>
                    )}
                </div>

                {/* MOBILE (cards) */}
                <div className="space-y-3 md:hidden">
                    {roles.map((role) => (
                        <div
                            key={role.id}
                            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-gray-100">{role.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: {role.id}</div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <Link
                                        href={route('roles.show', role.id)}
                                        className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                    >
                                        Show
                                    </Link>
                                    {canEdit && (
                                        <Link
                                            href={route('roles.edit', role.id)}
                                            className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                        >
                                            Edit
                                        </Link>
                                    )}
                                    {canDelete && (
                                        <Button
                                            onClick={() => handleDelete(role.id)}
                                            className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DESKTOP (table) */}
                <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:block dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                        <thead className="bg-gray-50 dark:bg-transparent">
                            <tr>
                                <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">ID</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Name</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Permissions</th>
                                <th className="py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {roles.map((role) => (
                                <tr key={role.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                                    <td className="py-4 pr-3 pl-6 text-sm font-medium text-gray-900 dark:text-gray-200">{role.id}</td>
                                    <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{role.name}</td>
                                    <td className="px-3 py-4 text-sm">
                                        <Link
                                            href={route('roles.show', role.id)}
                                            className="text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-300"
                                        >
                                            Show
                                        </Link>
                                    </td>
                                    <td className="py-4 pr-6 pl-3 text-right text-sm">
                                        <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                            {canEdit && (
                                                <Link href={route('roles.edit', role.id)} className="hover:text-green-600 dark:hover:text-green-300">
                                                    Edit
                                                </Link>
                                            )}
                                            {canDelete && (
                                                <Button
                                                    onClick={() => handleDelete(role.id)}
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
