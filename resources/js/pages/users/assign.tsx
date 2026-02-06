import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, User, Role } from '@/types';
import RoleAssignFields from '@/components/users/user-assign-fields';

interface Props {
    user: User;
    globalRoles: Role[];
    businessRoles: Role[];
    userRole: number[];
}

export default function Assign({ user, globalRoles, businessRoles, userRole }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.users'), href: '/users' },
        { title: t('breadcrumb.users.assign'), href: '/users' },
    ];

        const usersBack = () => {
            router.get(route('users.index'));
        };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.assign.title')} />
            <meta name="description" content="Assign roles to a user" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('users.assign.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.assign.description')}</p>
                    </div>

                    <Button variant="outline" onClick={() => usersBack()}>
                        {t('users.assign.back')}
                    </Button>
                </div>

                <RoleAssignFields user={user} globalRoles={globalRoles} businessRoles={businessRoles} userRole={userRole} />
            </div>
        </AppLayout>
    );
}
