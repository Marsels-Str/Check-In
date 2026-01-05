import { router } from '@inertiajs/react';
import type { MessageReminderState } from '@/types';

type Props = MessageReminderState;

export default function MessageReminder({ data, empty }: Props) {
    if (empty === 'nothing-to-show') {
        return (
            <div className="h-64 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                Get a job, to view personal group messages.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {data.map((groups) => (
                <button
                    key={groups.group_id}
                    onClick={() => router.visit(`/groups/${groups.group_id}`)}
                    className="w-full rounded-md border border-gray-200 p-3 text-left transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={groups.has_unread ? 'text-purple-600' : 'text-gray-400'}>{groups.has_unread ? '🟣' : '⚪'}</span>
                            <span className="font-medium">{groups.group_name}</span>
                        </div>

                        {groups.has_unread ? (
                            <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs text-white">{groups.unread_count}</span>
                        ) : (
                            <span className="text-xs text-gray-400">0</span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
