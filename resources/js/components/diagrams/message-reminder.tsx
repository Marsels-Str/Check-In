import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';

export default function MessageReminder() {
    const { message } = useDashboardData();

    const data = message?.data ?? [];
    const empty = message?.empty;

    const t = useT();

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center text-center rounded-xl text-sm text-muted-foreground">
                {t('dashboard.diagrams.messages.empty')}
            </div>
        );
    }

    return (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            {data.map((group) => {
                const isUnread = group.has_unread;

                return (
                    <button
                        key={group.group_id}
                        onClick={() => router.visit(`/groups/${group.group_id}`)}
                        className={`group relative flex cursor-pointer items-center justify-between px-4 py-3 text-left transition ${
                            isUnread ? 'hover:bg-[#D4A017]/40 dark:hover:bg-[#D4A017]/40' : 'hover:bg-gray-100 dark:hover:bg-gray-800/60'
                        }`}
                    >
                        <span className={`absolute top-0 left-0 h-full w-1 ${isUnread ? 'bg-[#D4A017]' : 'bg-transparent'}`} />

                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{group.group_name}</span>

                            <span className="text-xs text-muted-foreground">
                                {isUnread ? t('dashboard.diagrams.messages.status.new') : t('dashboard.diagrams.messages.status.none')}
                            </span>
                        </div>

                        {isUnread && (
                            <span className="ml-4 rounded-full bg-[#D4A017] px-2 py-0.5 text-xs font-medium text-black">{group.unread_count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
