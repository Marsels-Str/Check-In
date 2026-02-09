import { useT } from '@/lib/t';
import { useCan } from '@/lib/can';
import { GroupIndex } from '@/types';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Props {
    groups: GroupIndex[];
}

export default function GroupMobileView({ groups }: Props) {
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

    if (!groups.length) {
        return <div className="rounded-xl border px-4 py-2 text-center text-muted-foreground italic md:hidden">{t('groups.index.empty')}</div>;
    }

    return (
        <div className="md:hidden space-y-2">
            {groups.map((group) => (
                <div key={group.id} className="rounded-xl border bg-background p-2 shadow-md">
                    <div className="flex justify-between">
                        <div>
                            {canAccess && <div className="font-bold text-xl dark:text-white">{t('groups.index.id')}: {group.id}</div>}

                            <div className="dark:text-white font-bold text-sm">{group.name}</div>
                            
                            <p className="dark:text-white text-sm text-muted-foreground">{group.description}</p>
                            
                            {canAccess && <div className="text-xs text-muted-foreground">{group.business.name}</div>}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        {canShow && (
                            <Button variant="link" className="px-0 text-blue-700 dark:text-blue-500" onClick={() => groupsShow(group)}>
                                {t('groups.index.show')}
                            </Button>
                        )}

                        {canUpdate && (
                            <Button variant="link" className="px-0 text-yellow-700 dark:text-yellow-500" onClick={() => groupsEdit(group)}>
                                {t('groups.index.edit')}
                            </Button>
                        )}

                        {canDelete && (
                            <Button variant="link" className="px-0 text-red-700 dark:text-red-500" onClick={() => groupsDelete(group)}>
                                {t('groups.index.delete')}
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
