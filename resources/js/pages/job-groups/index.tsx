import { Link, Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { can } from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Groups',
        href: '/job-groups',
    },
];

export default function Index({ jobGroups }: { jobGroups: any[] }) {

    function handleDelete(id: number) {
            if (confirm('Are you sure you want to delete this group?')) {
                router.delete(route('job-groups.destroy', id));
            }
        }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Group"/>
                <h1 className="flex justify-center text-3xl font-bold leading-tight md:text-5xl">Job Group</h1>

                <div>
                    {can('groups.create') &&
                    <Link
                        href={route('job-groups.create')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Create
                    </Link>
                    }
                </div>

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
                                Description
                            </th>
                            <th className="border-b border-gray-400 text-gray-500 dark:text-gray-400">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {jobGroups.map(jobGroup => (
                            <tr key={jobGroup.id} className='text-center'>
                                <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">
                                    {jobGroup.id}
                                </td>

                                <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">
                                    {jobGroup.name}
                                </td>
                                
                                <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                    {jobGroup.description}
                                </td>

                                <td className="border-b border-gray-400">
                                    
                                        <Link
                                            href={route('job-groups.show', jobGroup.id)}
                                            className="text-yellow-500 hover:text-yellow-700 mr-2">
                                            Show
                                        </Link>
                                    
                                    {can('groups.edit') &&
                                        <Link
                                            href={route('job-groups.edit', jobGroup.id)}
                                            className="text-blue-500 hover:text-blue-700 mr-2">
                                            Edit
                                        </Link>
                                    }

                                    {can('groups.delete') &&
                                        <Link
                                            onClick={() => handleDelete(jobGroup.id)}
                                            className="text-red-500 hover:text-red-700">
                                            Delete
                                        </Link>
                                    }
                                </td>
                            </tr>
                    ))}
                    </tbody>
                </table>
        </AppLayout>
    );
}
