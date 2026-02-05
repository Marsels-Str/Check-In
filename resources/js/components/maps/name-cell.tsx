import { useT } from '@/lib/t';
import { useRef } from 'react';

export default function NameCell({
    id,
    name,
    activeId,
    setActiveId,
}: {
    id: number;
    name?: string;
    activeId: number | null;
    setActiveId: (id: number | null) => void;
}) {
    const isOpen = activeId === id;
    const ref = useRef<HTMLDivElement | null>(null);
    const t = useT();

    const hasName = Boolean(name && name.trim().length > 0);

    const base =
        'inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ease-out ring-1 ring-inset active:scale-95';

    const yellow = isOpen
        ? 'bg-yellow-200/40 text-yellow-800 ring-yellow-400/60 dark:bg-yellow-900/40 dark:text-yellow-200 dark:ring-yellow-500/60'
        : 'bg-yellow-100 text-yellow-700 ring-yellow-300/50 hover:ring-2 hover:ring-yellow-400/70 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/40 dark:hover:ring-yellow-400/70';

    const green = isOpen
        ? 'bg-emerald-200/40 text-emerald-800 ring-emerald-400/60 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-500/60'
        : 'bg-emerald-100 text-emerald-700 ring-emerald-300/50 hover:ring-2 hover:ring-emerald-400/70 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/40 dark:hover:ring-emerald-400/70';

    return (
        <div ref={ref} className="relative inline-block">
            <button type="button" onClick={() => setActiveId(isOpen ? null : id)} className={`${base} ${hasName ? green : yellow}`}>
                {t('maps.name')}
            </button>

            {isOpen && (
                <div
                    className={`absolute top-1/2 left-full z-20 ml-3 min-w-[180px] -translate-y-1/2 rounded-lg border px-3 py-2 text-sm shadow-lg ring-1 backdrop-blur-sm ${
                        hasName
                            ? 'border-emerald-400/40 bg-emerald-100/80 text-emerald-900 ring-emerald-400/40 dark:border-emerald-500/40 dark:bg-emerald-900/50 dark:text-emerald-200 dark:ring-emerald-500/40'
                            : 'border-yellow-400/40 bg-yellow-100/80 text-yellow-900 ring-yellow-400/40 dark:border-yellow-500/40 dark:bg-yellow-900/50 dark:text-yellow-200 dark:ring-yellow-500/40'
                    }`}
                >
                    <p className="break-words">{name || t('maps.name.none')}</p>
                </div>
            )}
        </div>
    );
}
