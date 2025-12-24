import { router } from '@inertiajs/react';

type Range = 'week' | 'month';

export default function WorkedHoursRangeToggle({ range }: { range: Range }) {
    function changeRange(newRange: Range) {
        router.get(
            route('dashboard'),
            {   ...route().params,
                range: newRange },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            }
        );
    }

    return (
        <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(['week', 'month'] as Range[]).map((r) => (
                <button
                    key={r}
                    onClick={() => changeRange(r)}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                        range === r
                            ? 'bg-background shadow'
                            : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {r === 'week' ? 'Week' : 'Month'}
                </button>
            ))}
        </div>
    );
}
