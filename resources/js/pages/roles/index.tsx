import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, BusinessProfile, Role } from '@/types';
import RoleMobileView from '@/components/roles/role-index-mobile';
import RoleDesktopView from '@/components/roles/role-index-desktop';

interface Props {
    roles: Role[];
    businesses: BusinessProfile[];
}

export default function Index({ roles, businesses }: Props) {
    const t = useT();

    const canCreate = useCan('roles.create');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.roles'),
            href: '/roles',
        },
    ];

    const rolesCreate = () => {
        router.get(route('roles.create'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('roles.index.title')} />
            <meta name="description" content="Manage roles and their permissions within the application" />

            <div className="p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('roles.index.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('roles.index.text')}</p>
                    </div>

                    {canCreate && <Button onClick={() => rolesCreate()}>{t('roles.index.create')}</Button>}
                </div>

                <RoleMobileView roles={roles} businesses={businesses} />

                <RoleDesktopView roles={roles} businesses={businesses} />
            </div>
        </AppLayout>
    );
}
