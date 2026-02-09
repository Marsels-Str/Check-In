import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import GroupMap from '@/components/groups/show-sections/group-map';
import GroupChat from '@/components/groups/show-sections/group-chat';
import GroupUsers from '@/components/groups/show-sections/group-users';
import GroupImages from '@/components/groups/show-sections/group-images';
import { BreadcrumbItem, GroupImage, GroupIndex, GroupMaps, GroupUser, User } from '@/types';

type ShowGroup = GroupIndex & GroupUser & GroupImage & GroupMaps;

interface Props {
    group: ShowGroup;
    users: User[];
    availableMaps: any;
}

export default function Show({ group, users, availableMaps }: Props) {
    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.groups'), href: '/groups' },
        { title: t('breadcrumb.groups.show'), href: '/groups' },
    ];

    const groupsBack = () => {
        router.get(route('groups.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('groups.show.title')}: ${group.name}`} />
            <meta name="description" content="View group details and manage group content" />

            <div className="space-y-4 p-4">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{group.name}</h1>
                        <p className="text-sm text-muted-foreground">{t('groups.show.text')}</p>
                    </div>

                    <Button variant="outline" onClick={() => groupsBack()}>
                        {t('groups.show.back')}
                    </Button>
                </div>

                <section className="border rounded-xl p-4 shadow-md">
                    <h2 className="text-lg font-bold">{t('groups.show.overview')}</h2>
                    <p>{group.description || t('groups.show.description')}</p>

                    <div className="grid grid-cols-2 space-x-2">
                        <div className="rounded-lg border p-3 shadow-md">
                            <div>{t('groups.show.business')}</div>
                            <div className="text-muted-foreground">{group.business?.name}</div>
                        </div>
                        <div className="rounded-lg border p-3 shadow-md">
                            <div>{t('groups.show.users')}</div>
                            <div className="text-muted-foreground">{group.users?.length ?? 0}</div>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border p-2 shadow-md">
                    <GroupUsers group={group} users={users} />
                </section>

                <section className="rounded-xl border p-2 shadow-md">
                    <h2 className="text-lg font-bold">{t('groups.show.chat')}</h2>

                    <GroupChat groupId={group.id} />
                </section>

                <section className="rounded-xl border p-2 shadow-md">
                    <h2 className="text-lg font-bold">{t('groups.show.images')}</h2>
                    <GroupImages group={group} />
                </section>

                <section className="rounded-xl border p-2 shadow-md">
                    <h2 className="mb-4 text-lg font-semibold">{t('groups.show.maps')}</h2>
                    <GroupMap group={group} availableMaps={availableMaps} />
                </section>
            </div>
        </AppLayout>
    );
}
