import { useT } from '@/lib/t';
import { Language } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
    language: Language;
}

interface ProgressResponse {
    status: 'none';
    total?: number;
    processed?: number;
    progress?: number;
}

export default function SyncProgress({ language }: Props) {
    const [data, setData] = useState<ProgressResponse | null>(null);

    const t = useT();

    useEffect(() => {
        if (!language.translation_batch_id) return;

        const interval = setInterval(async () => {
            const res = await fetch(route('languages.progress', { language: language.id }));

            const json = await res.json();
            setData(json);

            if (json.status === 'finished') {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [language]);

    if (!language.translation_batch_id || !data || data.status === 'none') return null;

    return (
        <div className="rounded-lg border bg-background p-2 shadow-md">
            <div className="font-bold">{t('languages.index.progress')}...</div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${data.progress ?? 0}%` }} />
            </div>

            <div className="text-muted-foreground">
                {data.processed} / {data.total} {t('languages.index.processed')}
            </div>
        </div>
    );
}
