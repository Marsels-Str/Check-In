import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Show Role',
        href: '/roles',
    },
];

export default function Show({ role, permissions }: { role: any; permissions: string[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create" />
            <div>
                <Link
                    href={route('roles.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>

                <div>
                    <p>
                        <strong>Name: </strong>
                        {role.name}
                    </p>
                    <p>
                        <strong>Permissions: </strong>
                    </p>
                    {permissions.map((permission) => (
                        <span className="mr-2 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-200 dark:text-blue-800">
                            {permission}
                        </span>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
