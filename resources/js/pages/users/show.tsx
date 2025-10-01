import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
    {
        title: 'Show Users',
        href: '/users',
    },
];

export default function Show({ user }: { user: any }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Show" />
            <div>
                <Link
                    href={route('users.index')}
                    className="inline-flex items-center rounded border border-transparent bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                >
                    Back
                </Link>
            </div>

            <div>
                Name: {user.name} <br />
                Email: {user.email}
            </div>
        </AppLayout>
    );
}
