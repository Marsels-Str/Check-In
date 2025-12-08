import RoleAssignFields from '@/components/users/user-assign-fields';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Assign Role', href: '/users' },
];

export default function Assign({
    user,
    globalRoles = [] as { id: number; name: string }[],
    businessRoles = [] as { id: number; name: string }[],
    userRoles = [] as number[],
}: {
    user: User;
    globalRoles: { id: number; name: string }[];
    businessRoles: { id: number; name: string }[];
    userRoles: number[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Assign Role" />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Assign a Role</h1>
                        <p className="text-sm text-gray-500">Assigning a role will allow the user to perform certain actions.</p>
                    </div>

                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Back
                    </Link>
                </div>

                <RoleAssignFields userId={user.id} globalRoles={globalRoles} businessRoles={businessRoles} selectedRoles={userRoles} />
            </div>
        </AppLayout>
    );
}
