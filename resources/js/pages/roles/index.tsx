import RoleDesktopView from '@/components/roles/role-index-desktop';
import RoleMobileView from '@/components/roles/role-index-mobile';
import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Roles', href: '/roles' }];

export default function Index({ roles }: { roles: any[] }) {
    const canCreate = useCan('roles.create');

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

                <RoleMobileView roles={roles} />

                <RoleDesktopView roles={roles} />
            </div>
        </AppLayout>
    );
}
