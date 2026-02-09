import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import LiveTimer from '@/components/live-timer';
import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/users/tiny-ui/user-avatar';

export default function PersonalPanel({ self }: { self: any }) {
    const t = useT();

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
        <div className="flex h-64 flex-col p-2 justify-between">
            <div className="flex flex-col items-center">
                <UserAvatar user={self} />

                <p className="font-bold">{self.name}</p>

                <p className="text-muted-foreground">
                    {isWorking ? t('dashboard.diagrams.overview.personal.status.in') : t('dashboard.diagrams.overview.personal.status.out')}
                </p>
            </div>

            <div className="text-center">
                {isWorking && startTime && (
                    <div className="text-lg font-bold text-green-700 dark:text-green-500">
                        <LiveTimer startTime={startTime} />
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center">
                {isWorking ? (
                    <Button variant="destructive" onClick={clockOut}>
                        {t('dashboard.diagrams.overview.personal.action.out')}
                    </Button>
                ) : (
                    <Button variant="default" onClick={clockIn}>
                        {t('dashboard.diagrams.overview.personal.action.in')}
                    </Button>
                )}
            </div>
        </div>
    );
}
