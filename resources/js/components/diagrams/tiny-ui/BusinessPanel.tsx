import clsx from 'clsx';
import { useT } from '@/lib/t';
import LiveTimer from '@/components/live-timer';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';

export default function BusinessPanel({ users }: { users: any[] }) {
    const t = useT();

    const status = t('dashboard.diagrams.overview.business.status');

    if (users.length === 0) {
        return (
            <div className="flex h-64 items-center justify-center text-center italic text-muted-foreground">
                {t('dashboard.diagrams.overview.business.empty')}
            </div>
        );
    }

    return (
        <div className="flex h-64 flex-col overflow-y-auto p-2">

            <ul className="space-y-2">
                {users.map((user) => {
                    const clockIn = user.time_logs?.[0]?.clock_in;
                    const isActive = Boolean(clockIn);

                    return (
                        <li
                            key={user.id}
                            className={clsx(
                                'flex space-x-2 rounded-xl px-4 py-2',
                                isActive ? 'bg-green-50/60 dark:bg-green-900/20' : 'bg-pink-50/50 dark:bg-pink-900/20',
                            )}
                        >
                            <UserAvatar user={user} />

                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className={clsx('truncate font-medium', !isActive && 'text-[#FF4081]')}>{user.name}</span>

                                    <span className={clsx('h-2 w-2 rounded-full', isActive ? 'bg-green-500' : 'bg-[#FF4081]')} />
                                </div>

                                {isActive ? (
                                    <div className="rounded bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                        <LiveTimer key={clockIn} startTime={clockIn} />
                                    </div>
                                ) : (
                                    user.offline_for && (
                                        <div className="text-[#FF4081]/80">
                                            {status} {user.offline_for}
                                        </div>
                                    )
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
