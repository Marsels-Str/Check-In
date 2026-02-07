import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { BreadcrumbItem, GroupIndex } from '@/types';

interface Props {
    groups: GroupIndex[];
}

export default function Index({ groups }: Props) {
    const canCreate = useCan('groups.create');
    const canUpdate = useCan('groups.update');
    const canDelete = useCan('groups.delete');
    const canShow = useCan('groups.show');
    const canAccess = useCan('business.access');

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

                <div className="rounded-lg border bg-background shadow-xl">
                    <div className="overflow-y-auto">
                        <table className="min-w-full divide-y">
                            <thead className="sticky top-0 bg-muted">
                                <tr>
                                    <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.id')}</th>
                                    <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.name')}</th>
                                    <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.description')}</th>
                                    {canAccess && <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.business')}</th>}
                                    <th className="px-4 py-2 text-right font-bold dark:text-white">{t('groups.index.actions')}</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {groups.length > 0 ? (
                                    groups.map((group) => (
                                        <tr key={group.id} className="hover:bg-muted">
                                            <td className="px-4 py-2 dark:text-white">{group.id}</td>
                                            <td className="px-4 py-2 dark:text-white">{group.name}</td>
                                            <td className="px-4 py-2 dark:text-white">{group.description || '—'}</td>
                                            {canAccess && <td className="px-4 py-2 dark:text-white">{group.business.name}</td>}

                                            <td className="px-4 py-2 text-right">
                                                <div className="flex justify-end space-x-2 dark:text-white">
                                                    {canShow && (
                                                        <Button
                                                            variant="link"
                                                            className="px-0 text-blue-700 dark:text-blue-500"
                                                            onClick={() => groupsShow(group)}
                                                        >
                                                            {t('groups.index.show')}
                                                        </Button>
                                                    )}

                                                    {canUpdate && (
                                                        <Button
                                                            variant="link"
                                                            className="px-0 text-yellow-700 dark:text-yellow-500"
                                                            onClick={() => groupsEdit(group)}
                                                        >
                                                            {t('groups.index.edit')}
                                                        </Button>
                                                    )}

                                                    {canDelete && (
                                                        <Button
                                                            variant="link"
                                                            className="px-0 text-red-700 dark:text-red-500"
                                                            onClick={() => groupsDelete(group)}
                                                        >
                                                            {t('groups.index.delete')}
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground italic">
                                            {t('groups.index.empty')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
