import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';

type Range = 'week' | 'month';

type Props = {
    range: Range;
    param: string;
};

export default function RangeToggle({ range, param }: Props) {
    const t = useT();
    
    function changeRange(newRange: Range) {
        router.get(
            route('dashboard'),
            {
                ...route().params,
                [param]: newRange,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    }

    return (
        <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(['week', 'month'] as Range[]).map((r) => (
                <button
                    key={r}
                    onClick={() => changeRange(r)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                        range === r ? 'bg-background shadow' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {r === 'week' ? t('dashboard.diagrams.range.week') : t('dashboard.diagrams.range.month')}
                </button>
            ))}
        </div>
    );
}
