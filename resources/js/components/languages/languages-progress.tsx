import { useT } from '@/lib/t';
import { useEffect, useState } from 'react';

interface Props {
    languageId: number;
    batchId: string | null;
}

interface ProgressResponse {
    status: 'none' | 'missing' | 'running' | 'finished';
    total?: number;
    processed?: number;
    failed?: number;
    progress?: number;
}

export default function SyncProgress({ languageId, batchId }: Props) {
    const [data, setData] = useState<ProgressResponse | null>(null);

    const t = useT();

    useEffect(() => {
        if (!batchId) return;

        const interval = setInterval(async () => {
            const res = await fetch(route('languages.progress', languageId));

            const json = await res.json();
            setData(json);

            if (json.status === 'finished') {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [languageId, batchId]);

    if (!batchId || !data || data.status === 'none') return null;

    return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
            <div className="font-bold">{t('languages.index.progress')}...</div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${data.progress ?? 0}%` }} />
            </div>

            <div className="text-muted-foreground">
                {data.processed} / {data.total} {t('languages.index.processed')}
                {data.failed ? ` • ${data.failed} failed` : ''}
            </div>
        </div>
    );
}
