import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
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

export default function Show({ role, permissions }: { role: any, permissions: string[] }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Role Create"/>
                <div>
                    <Link
                        href={route('roles.index')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Back
                    </Link>

                    <div>
                        <p><strong>Name: </strong>{role.name}</p>
                        <p><strong>Permissions: </strong></p>
                        { permissions.map((permission) =>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                                        {permission}
                                    </span>
                                )}
                    </div>
                </div>
        </AppLayout>
    );
}
