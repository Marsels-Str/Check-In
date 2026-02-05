import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, BusinessProfile } from '@/types';
import RoleCreateFields from '@/components/roles/roles-create-fields';


interface Props {
    permissions: string[];
    businesses: BusinessProfile[];
    auth: any;
}

export default function Create({ permissions, businesses, auth }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.roles'), href: '/roles' },
        { title: t('breadcrumb.roles.create'), href: '/roles/create' },
    ];

    const rolesBack = () => {
        router.get(route('roles.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('roles.create.title')} />
            <meta name="description" content="Create a new role and assign permissions" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('roles.create.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('roles.create.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => rolesBack()}>
                        {t('roles.create.back')}
                    </Button>
                </div>

                <RoleCreateFields permissions={permissions} businesses={businesses} auth={auth} />
            </div>
        </AppLayout>
    );
}
