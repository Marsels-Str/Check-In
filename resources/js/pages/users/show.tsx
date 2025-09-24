import { type BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
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
            <Head title="User Show"/>
                <div>
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Back
                    </Link>
                </div>

                <div>
                    Name: {user.name} <br/>
                    Email: {user.email}
                </div>
        </AppLayout>
    );
}
