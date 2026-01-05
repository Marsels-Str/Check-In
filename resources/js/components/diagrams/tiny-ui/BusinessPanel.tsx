import LiveTimer from '@/components/live-timer';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';
import clsx from 'clsx';

export default function BusinessPanel({ users }: { users: any[] }) {
    return (
        <div className="flex h-64 flex-col overflow-y-auto rounded-xl p-4">
            <p className="mb-3 font-semibold">Employees</p>

            <ul className="space-y-2">
                {users.map((user) => {
                    const clockIn = user.time_logs?.[0]?.clock_in;
                    const isActive = Boolean(clockIn);

                    return (
                        <li
                            key={user.id}
                            className={clsx(
                                'flex items-center gap-3 rounded-md px-2 py-2 transition-colors',
                                isActive ? 'bg-green-50/60 dark:bg-green-900/20' : 'bg-pink-50/50 dark:bg-pink-900/20',
                            )}
                        >
                            <UserAvatar user={user} />

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={clsx('truncate text-sm font-medium', !isActive && 'text-[#FF4081]')}>{user.name}</span>

                                    <span className={clsx('h-2 w-2 rounded-full', isActive ? 'bg-green-500' : 'bg-[#FF4081]')} />
                                </div>

                                {isActive ? (
                                    <div className="mt-0.5 inline-flex items-center rounded bg-green-100 px-1.5 py-0.5 font-mono text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                        <LiveTimer key={clockIn} startTime={clockIn} />
                                    </div>
                                ) : (
                                    user.offline_for && <div className="text-xs text-[#FF4081]/80">last seen {user.offline_for}</div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
