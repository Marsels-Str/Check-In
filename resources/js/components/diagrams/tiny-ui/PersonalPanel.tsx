import LiveTimer from '@/components/live-timer';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function PersonalPanel({ self }: { self: any }) {
    const [isWorking, setIsWorking] = useState(self.is_clocked_in);
    const [startTime, setStartTime] = useState<string | null>(self.time_logs?.[0]?.clock_in ?? null);

    useEffect(() => {
        setIsWorking(self.is_clocked_in);
        setStartTime(self.time_logs?.[0]?.clock_in ?? null);
    }, [self.is_clocked_in, self.time_logs]);

    const clockIn = () => {
        const now = new Date().toISOString();
        setIsWorking(true);
        setStartTime(now);

        router.post(
            route('employees.clockin', self.id),
            {},
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    const clockOut = () => {
        setIsWorking(false);
        setStartTime(null);

        router.post(
            route('employees.clockout', self.id),
            {},
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    return (
        <div className="flex h-64 flex-col justify-between rounded-xl p-4 text-center">
            <div className="flex flex-col items-center gap-2">
                <UserAvatar user={self} />
                <p className="leading-tight font-semibold">{self.name}</p>

                <p className="text-xs text-muted-foreground">{isWorking ? 'Currently working' : 'Not clocked in'}</p>
            </div>

            <div className="flex flex-col items-center gap-3">
                {isWorking && startTime && (
                    <div className="font-mono text-lg font-semibold text-green-600 dark:text-green-400">
                        <LiveTimer startTime={startTime} />
                    </div>
                )}

                {isWorking ? (
                    <Button
                        onClick={clockIn}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Clock-in
                    </Button>
                ) : (
                    <Button
                        onClick={clockOut}
                        variant="destructive"
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Clock-out
                    </Button>
                )}
            </div>
        </div>
    );
}
