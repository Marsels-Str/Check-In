import UsersDesktopView from '@/components/users/user-index-desktop';
import UserIndexCards from '@/components/users/user-index-mobile';
import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Users', href: '/users' }];

export default function Index({ users, currentUser }: { users: User[]; currentUser: User }) {
    const canCreate = useCan('users.create');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Users</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">A list of all the users including their business and role.</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            Add
                        </Link>
                    )}
                </div>

                <UserIndexCards users={users} currentUser={currentUser} />

                <UsersDesktopView users={users} currentUser={currentUser} />
            </div>
        </AppLayout>
    );
}
