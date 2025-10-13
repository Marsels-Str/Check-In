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

            <div className="px-4">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{group.name}</h1>
                        <p className="text-sm text-gray-500">Manage members, images, and map entries for this job group.</p>
                    </div>

                    <Link
                        href={route('job-groups.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Back
                    </Link>
                </div>

                {/* Overview */}
                <section className="mb-8 rounded-xl border borde p-6 shadow-sm backdrop-blur-sm">
                    <h2 className="text-lg font-semibold">Overview</h2>
                    <p className="mt-2">{group.description || 'No description provided.'}</p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border border p-3 text-sm shadow-sm">
                            <div>Business</div>
                            <div className="font-medium text-gray-500">{group.business?.name || 'N/A'}</div>
                        </div>
                        <div className="rounded-lg border border p-3 text-sm shadow-sm">
                            <div>Users</div>
                            <div className="font-medium text-gray-500">{group.users?.length ?? 0}</div>
                        </div>
                    </div>
                </section>

                {/* Users */}
                <section className="mb-8 rounded-xl border border p-6 shadow-sm backdrop-blur-sm">
                    <GroupUsers group={group} users={users} canAdd={canAdd} canRemove={canRemove} />
                </section>

                {/* Images */}
                <section className="mb-8 rounded-xl border border p-6">
                    <h2 className="mb-4 text-lg font-semibold">Images</h2>
                    <GroupImages group={group} errors={errors} />
                </section>

                {/* Map */}
                <section className="rounded-xl border border p-6 shadow-sm backdrop-blur-sm dark:shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">Map entry</h2>
                    <GroupMap group={group} availableMaps={availableMaps} canAddMap={canAddMap} />
                </section>
            </div>
        </AppLayout>
    );
}
