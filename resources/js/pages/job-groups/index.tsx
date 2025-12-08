import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Groups', href: '/job-groups' }];

export default function Index({ jobGroups }: { jobGroups: any[] }) {
    const canCreate = useCan('groups.create');
    const canUpdate = useCan('groups.update');
    const canDelete = useCan('groups.delete');
    const canShow = useCan('groups.show');

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this group?')) {
            router.delete(route('job-groups.destroy', id));
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Job Groups" />

            <div className="px-4">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Job Groups</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage and organize your job groups efficiently.</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('job-groups.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Create
                        </Link>
                    )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600 max-h-[340px] overflow-y-auto md:max-h-[230px]">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="sticky top-0 z-10 bg-gray-50 backdrop-blur-sm dark:bg-[#0f0f0f]/95">
                                <tr>
                                    <th className="py-3.5 pr-3 pl-6 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">ID</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Name</th>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-300">Description</th>
                                    <th className="py-3.5 pr-6 pl-3 text-right text-sm font-semibold text-gray-900 dark:text-gray-300">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {jobGroups.length > 0 ? (
                                    jobGroups.map((group) => (
                                        <tr key={group.id} className="transition hover:bg-gray-50 dark:hover:bg-white/5">
                                            <td className="py-4 pr-3 pl-6 text-sm text-gray-900 dark:text-gray-200">{group.id}</td>
                                            <td className="px-3 py-4 text-sm text-gray-900 dark:text-gray-200">{group.name}</td>
                                            <td className="px-3 py-4 text-sm text-gray-700 dark:text-gray-300">{group.description || '—'}</td>
                                            <td className="py-4 pr-6 pl-3 text-right text-sm">
                                                <div className="flex justify-end gap-3 text-gray-600 dark:text-gray-400">
                                                    {canShow && (
                                                        <Link
                                                            href={route('job-groups.show', group.id)}
                                                            className="hover:text-green-600 dark:hover:text-green-300"
                                                        >
                                                            Show
                                                        </Link>
                                                    )}

                                                    {canUpdate && (
                                                        <Link
                                                            href={route('job-groups.edit', group.id)}
                                                            className="hover:text-green-600 dark:hover:text-green-300"
                                                        >
                                                            Edit
                                                        </Link>
                                                    )}

                                                    {canDelete && (
                                                        <button
                                                            onClick={() => handleDelete(group.id)}
                                                            className="text-red-600 hover:text-red-500 dark:text-red-500 dark:hover:text-red-400"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            No job groups found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
