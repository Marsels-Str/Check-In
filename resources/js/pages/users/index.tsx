import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, User } from '@/types';
import UserIndexCards from '@/components/users/user-index-mobile';
import UsersDesktopView from '@/components/users/user-index-desktop';

interface Props {
    users: User[];
    currentUser: User;
}

export default function Index({ users, currentUser }: Props) {
    const canCreate = useCan('users.create');

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.users'),
            href: '/users'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.index.title')} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('users.index.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.index.text')}</p>
                    </div>

                    {canCreate && (
                        <Link
                            href={route('users.create')}
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('users.index.add')}
                        </Link>
                    )}
                </div>

                <UserIndexCards users={users} currentUser={currentUser} />

                <UsersDesktopView users={users} currentUser={currentUser} />
            </div>
        </AppLayout>
    );
}
