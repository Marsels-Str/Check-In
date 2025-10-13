import UserForm from '@/components/users/user-edit-fields';
import UserProfileFields from '@/components/users/user-profile-edit-fields';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
    { title: 'Edit User', href: '/users' },
];

export default function Edit({ user }: { user: User }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit User" />
            <div className="px-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">Edit</h1>
                        <p className="text-sm text-gray-500">Edit an account and after that edit or add extended information.</p>
                    </div>
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Back
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="mb-4">
                        <h2 className="text-center text-lg font-semibold">Account Information</h2>
                        <UserForm user={user} />
                    </div>

                    <div className="mb-4">
                        <h2 className="text-center text-lg font-semibold">Profile Information</h2>

                        <UserProfileFields user_profile={{ ...user.profile, user_id: user.id }} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
