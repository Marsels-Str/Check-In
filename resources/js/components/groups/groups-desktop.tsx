import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { GroupIndex } from '@/types';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    groups: GroupIndex[];
}

export default function GroupDesktopView({ groups }: Props) {
    const canUpdate = useCan('groups.update');
    const canDelete = useCan('groups.delete');
    const canShow = useCan('groups.show');
    const canAccess = useCan('business.access');

    const t = useT();

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
        <div>
            <div className="overflow-hidden rounded-lg border bg-background shadow-xl hidden md:block">
                <div className="overflow-y-auto">
                    <table className="min-w-full divide-y">
                        <thead className="sticky top-0 bg-muted">
                            <tr>
                                {canAccess && <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.id')}</th>}
                                <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.name')}</th>
                                <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.description')}</th>
                                {canAccess && <th className="px-4 py-2 text-left font-bold dark:text-white">{t('groups.index.business')}</th>}
                                <th className="px-4 py-2 text-right font-bold dark:text-white">{t('groups.index.actions')}</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {groups.length ? (
                                groups.map((group) => (
                                    <tr key={group.id} className="hover:bg-muted">
                                        {canAccess && <td className="px-4 py-2 dark:text-white">{group.id}</td>}
                                        <td className="px-4 py-2 dark:text-white">{group.name}</td>
                                        <td className="px-4 py-2 dark:text-white">{group.description || '—'}</td>
                                        {canAccess && <td className="px-4 py-2 dark:text-white">{group.business.name}</td>}

                                        <td className="px-4 py-2 text-right">
                                            <div className="flex justify-end space-x-2">
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
                                    <td colSpan={5} className="px-4 py-2 text-center text-muted-foreground italic">
                                        {t('groups.index.empty')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
