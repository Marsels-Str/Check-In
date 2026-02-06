import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import UserForm from '@/components/users/user-edit-fields';
import UserProfileFields from '@/components/users/user-profile-edit-fields';

export default function Edit({ user }: { user: User }) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.users'), href: '/users' },
        { title: t('breadcrumb.users.edit'), href: '/users' },
    ];

    const usersBack = () => {
        router.get(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.edit.title')} />
            <meta name="description" content="Edit a user" />
            
            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('users.edit.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.edit.text')}</p>
                    </div>
                    <Button variant="outline" onClick={() => usersBack()}>
                        {t('users.edit.back')}
                    </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="p-2">
                        <UserForm user={user} />
                    </div>

                    <div className="p-2">
                        <UserProfileFields profile={{ ...user.profile, user_id: user.id }} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
