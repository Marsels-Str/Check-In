import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import UserMobileView from '@/components/users/user-index-mobile';
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

    const usersCreate = () => {
        router.get(route('users.create'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.index.title')} />
            <meta name="description" content="Manage your users" />

            <div className="p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('users.index.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.index.text')}</p>
                    </div>

                    {canCreate && (
                        <Button variant="default" onClick={() => usersCreate()}>
                            {t('users.index.add')}
                        </Button>
                    )}
                </div>

                <UserMobileView users={users} currentUser={currentUser} />

                <UsersDesktopView users={users} currentUser={currentUser} />
            </div>
        </AppLayout>
    );
}
