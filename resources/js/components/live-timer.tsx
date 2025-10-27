import { useEffect, useState } from 'react';

export default function LiveTimer({ startTime }: { startTime: string }) {
    const [elapsed, setElapsed] = useState('');

    useEffect(() => {
        const update = () => {
            const start = new Date(startTime);

            start.setHours(start.getHours());

            const now = new Date().getTime();
            const diff = Math.floor((now - start.getTime()) / 1000);

            const hours = Math.floor(diff / 3600);
            const minutes = Math.floor((diff % 3600) / 60);
            const seconds = diff % 60;

            setElapsed(
                `${hours.toString().padStart(2, '0')}:` + `${minutes.toString().padStart(2, '0')}:` + `${seconds.toString().padStart(2, '0')}`,
            );
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    return <span className="font-mono">{elapsed}</span>;
}
