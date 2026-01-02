import LiveTimer from '@/components/live-timer';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';

export default function BusinessPanel({ users }: { users: any[] }) {
    return (
        <div className="flex h-64 flex-col overflow-y-auto rounded-xl p-4">
            <p className="mb-3 font-semibold">Employees</p>

            <ul className="space-y-3">
                {users.map((user) => {
                    const clockIn = user.time_logs?.[0]?.clock_in;

                    return (
                        <li key={user.id} className="flex items-center gap-3">
                            <UserAvatar user={user} />

                            <div className="flex-1">
                                <div className="text-sm font-medium">{user.name}</div>

                                {clockIn && (
                                    <div className="text-xs text-green-600">
                                        <LiveTimer key={clockIn} startTime={clockIn} />
                                    </div>
                                )}

                                {!clockIn && user.offline_for && <div className="text-xs text-gray-500">last seen {user.offline_for}</div>}
                            </div>

                            <span className={`h-2 w-2 rounded-full ${clockIn ? 'bg-green-500' : 'bg-red-500'}`} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
