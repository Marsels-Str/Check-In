import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem, GroupIndex } from '@/types';
import GroupMobileView from '@/components/groups/groups-mobile';
import GroupDesktopView from '@/components/groups/groups-desktop';

interface Props {
    groups: GroupIndex[];
}

export default function Index({ groups }: Props) {
    const canCreate = useCan('groups.create');

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.groups'),
            href: '/groups',
        },
    ];

    const groupsCreate = () => {
        router.get(route('groups.create'));
    };

    const groupsShow = (group: GroupIndex) => {
        router.get(route('groups.show', group.id));
    };

    const groupsEdit = (group: GroupIndex) => {
        router.get(route('groups.edit', group.id));
    };

    const groupsDelete = (group: GroupIndex) => {
        router.delete(route('groups.destroy', group.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('groups.index.title')} />
            <meta name="description" content="Manage your groups, create and manage groups" />

            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('groups.index.label')}</h1>
                        <p className="text-mued-foreground text-sm">{t('groups.index.text')}</p>
                    </div>

                    {canCreate && (
                        <Button variant="default" onClick={() => groupsCreate()}>
                            {t('groups.index.create')}
                        </Button>
                    )}
                </div>

                <GroupMobileView groups={groups} />

                <GroupDesktopView groups={groups} />
            </div>
        </AppLayout>
    );
}
