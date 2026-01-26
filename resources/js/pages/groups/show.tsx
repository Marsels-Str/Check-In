import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import GroupMap from '@/components/groups/group-map';
import GroupChat from '@/components/groups/group-chat';
import GroupUsers from '@/components/groups/group-users';
import GroupImages from '@/components/groups/group-images';

export default function Show({ group, users, errors, availableMaps }: any) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.groups'), href: '/groups' },
        { title: t('breadcrumb.groups.show'), href: '/groups' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('groups.show.title')}: ${group.name}`} />

            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold">{group.name}</h1>
                        <p className="text-sm text-gray-500">{t('groups.show.text')}</p>
                    </div>

                    <Link
                        href={route('groups.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('groups.show.back')}
                    </Link>
                </div>

                <section className="borde mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm">
                    <h2 className="text-lg font-semibold">{t('groups.show.overview')}</h2>
                    <p className="mt-2">{group.description || t('groups.show.description')}</p>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-lg border p-3 text-sm shadow-sm">
                            <div>{t('groups.show.business')}</div>
                            <div className="font-medium text-gray-500">{group.business?.name}</div>
                        </div>
                        <div className="rounded-lg border p-3 text-sm shadow-sm">
                            <div>{t('groups.show.users')}</div>
                            <div className="font-medium text-gray-500">{group.users?.length ?? 0}</div>
                        </div>
                    </div>
                </section>

                <section className="mb-8 rounded-xl border p-6 shadow-sm backdrop-blur-sm">
                    <GroupUsers group={group} users={users} />
                </section>

                <section className="mb-8 rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">{t('groups.show.chat')}</h2>

                    <GroupChat
                        groupId={group.id}
                    />
                </section>

                <section className="mb-8 rounded-xl border p-6">
                    <h2 className="mb-4 text-lg font-semibold">{t('groups.show.images')}</h2>
                    <GroupImages group={group} errors={errors} />
                </section>

                <section className="rounded-xl border p-6 shadow-sm backdrop-blur-sm dark:shadow-sm">
                    <h2 className="mb-4 text-lg font-semibold">{t('groups.show.maps')}</h2>
                    <GroupMap group={group} availableMaps={availableMaps} />
                </section>
            </div>
        </AppLayout>
    );
}
