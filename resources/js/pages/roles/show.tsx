import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Role } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    role: Role;
    permissions: string[];
}

export default function Show({ role, permissions }: Props) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.roles'), href: '/roles' },
        { title: t('breadcrumb.roles.show'), href: '/roles' },
    ];

    const rolesBack = () => {
        router.get(route('roles.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('roles.show.title')}: ${role.name}`} />
            <meta name="description" content="View role details and assigned permissions" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('roles.show.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('roles.show.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => rolesBack()}>
                        {t('roles.show.back')}
                    </Button>
                </div>

                <div className="mx-auto max-w-2xl rounded-lg border bg-background p-4 shadow-xl">
                    <div>
                        <p className="text-xl font-bold dark:text-white">{t('roles.show.name')}:</p>
                        <p className="text-sm text-muted-foreground">{role.name}</p>
                    </div>

                    <div>
                        <p className="text-xl font-bold dark:text-white">{t('roles.show.permissions')}:</p>
                        <div className="flex flex-wrap gap-2">
                            {permissions.map((permission, id) => (
                                <span
                                    key={id}
                                    className="rounded-full bg-gray-100 px-3 py-1 ring-1 ring-gray-400/30 dark:bg-gray-800/60 dark:text-gray-100 dark:ring-gray-400/40"
                                >
                                    {permission}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
