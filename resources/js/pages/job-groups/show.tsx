import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import GroupImages from '../../components/groups/group-images';
import GroupMap from '../../components/groups/group-map';
import GroupUsers from '../../components/groups/group-users';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Groups', href: '/job-groups' },
    { title: 'Show Group', href: '/job-groups' },
];

export default function Show({ group, users, errors, availableMaps }: any) {
    const canAdd = useCan('users.add');
    const canRemove = useCan('users.remove');
    const canAddMap = useCan('maps.add');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Group: ${group.name}`} />

            <div className="mx-auto max-w-5xl p-6">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href={route('job-groups.index')}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                    >
                        ← Back to Groups
                    </Link>
                </div>

                <div className="mb-8 rounded-xl border border-gray-400 p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">{group.name}</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{group.description || 'No description provided.'}</p>

                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        <p>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Business:</span> {group.business?.name || 'N/A'}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Users:</span> {group.users?.length || 0}
                        </p>
                    </div>
                </div>

                <div className="mb-8 rounded-xl border border-gray-400 p-6">
                    <GroupUsers group={group} users={users} canAdd={canAdd} canRemove={canRemove} />
                </div>

                <div className="mb-8 rounded-xl border border-gray-400 p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Group Images</h2>
                    <GroupImages group={group} errors={errors} />
                </div>

                <div className="rounded-xl border border-gray-400 p-6">
                    <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">Group Map</h2>
                    <GroupMap group={group} availableMaps={availableMaps} canAddMap={canAddMap} />
                </div>
            </div>
        </AppLayout>
    );
}
