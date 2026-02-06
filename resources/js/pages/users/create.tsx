import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import UserCreateFields from '@/components/users/user-create-fields';

export default function Create() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.users.create'),
            href: '/users'
        }
    ];

    const usersBack = () => {
        router.get(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('users.create.title')} />
            <meta name="description" content="Create a new user" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('users.create.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.create.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => usersBack()}>
                        {t('users.create.back')}
                    </Button>
                </div>

                <div className="mx-auto max-w-md rounded-lg border shadow-xl">
                    <h2 className="text-center text-lg font-bold">
                        {t('users.create.info')}
                    </h2>

                    <UserCreateFields />
                </div>
            </div>
        </AppLayout>
    );
}
