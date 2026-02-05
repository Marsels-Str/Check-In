import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { Button } from '@/components/ui/button';
import RolesEditFields from '@/components/roles/roles-edit-fields';

interface Props {
    role: Role;
    rolePermissions: string[];
    permissions: string[];
}

export default function Edit({ role, rolePermissions, permissions }: Props) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.roles'), href: '/roles' },
        { title: t('breadcrumb.roles.edit'), href: '/roles' },
    ];

    const rolesBack = () => {
        router.get(route('roles.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('roles.edit.title')}: ${role.name}`} />
            <meta name="description" content="Edit a role and assign permissions" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('roles.edit.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('roles.edit.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => rolesBack()}>
                        {t('roles.edit.back')}
                    </Button>
                </div>

                <RolesEditFields role={role} rolePermissions={rolePermissions} permissions={permissions} />
            </div>
        </AppLayout>
    );
}
