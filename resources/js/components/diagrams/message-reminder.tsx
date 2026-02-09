import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';

export default function MessageReminder() {
    const { message } = useDashboardData();

    const data = message?.data ?? [];
    const empty = message?.empty;

    const t = useT();

    if (empty === 'no-business') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl text-center text-muted-foreground italic">
                {t('dashboard.diagrams.messages.empty')}
            </div>
        );
    }

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl text-center text-muted-foreground italic">
                {t('dashboard.diagrams.messages.none')}
            </div>
        );
    }

    return (
        <div className="flex h-64 flex-col divide-y overflow-y-auto">
            {data.map((group) => {
                const isUnread = group.has_unread;

                return (
                    <button
                        key={group.group_id}
                        onClick={() => router.visit(`/groups/${group.group_id}`)}
                        className={`flex cursor-pointer items-center px-4 py-2 text-left ${isUnread ? 'hover:bg-muted' : 'hover:bg-muted'}`}
                    >
                        <span className={`absolute top-0 left-0 h-full w-1 ${isUnread ? 'bg-yellow-500' : 'bg-transparent'}`} />

                        <div className="flex flex-col">
                            <span className="font-bold">{group.group_name}</span>

                            <span className="text-muted-foreground">
                                {isUnread ? t('dashboard.diagrams.messages.status.new') : t('dashboard.diagrams.messages.status.none')}
                            </span>
                        </div>

                        {isUnread && <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs font-medium">{group.unread_count}</span>}
                    </button>
                );
            })}
        </div>
    );
}
