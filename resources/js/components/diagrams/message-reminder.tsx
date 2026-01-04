import { router } from '@inertiajs/react';

type ReminderRow = {
    group_id: number;
    group_name: string;
    unread_count: number;
    has_unread: boolean;
    first_unread_at?: string | null;
};

export default function MessageReminder({
    messageReminders,
}: {
    messageReminders: { data: ReminderRow[]; empty?: string };
}) {
    const rows = messageReminders?.data ?? [];
    const isEmpty = !rows.length;

    if (isEmpty) {
        return (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                No new messages
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {rows.map((g) => (
                <button
                    key={g.group_id}
                    onClick={() => router.visit(`/groups/${g.group_id}`)}
                    className="
                        w-full text-left p-3 rounded-md
                        border border-gray-200 dark:border-gray-700
                        hover:bg-gray-50 dark:hover:bg-gray-800
                        transition
                    "
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className={g.has_unread ? "text-purple-600" : "text-gray-400"}>
                                {g.has_unread ? "🟣" : "⚪"}
                            </span>
                            <span className="font-medium">{g.group_name}</span>
                        </div>

                        {g.has_unread ? (
                            <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                                {g.unread_count}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">0</span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}
