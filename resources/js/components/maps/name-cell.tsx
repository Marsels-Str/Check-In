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

    return (
        <div ref={ref} className="relative inline-block">
            <button
                type="button"
                onClick={() => setActiveId(isOpen ? null : id)}
                className={`rounded-md px-2 py-1 text-sm font-medium ring-1 transition-all duration-300 ease-in-out ring-inset ${
                    isOpen
                        ? 'bg-yellow-200/30 text-yellow-700 ring-yellow-400/30 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/30'
                        : 'text-pink-700 ring-pink-400/30 hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30'
                }`}
            >
                Name
            </button>

            {isOpen && (
                <div className="absolute top-1/2 left-full z-20 ml-3 min-w-[180px] -translate-y-1/2 rounded-lg border border-pink-400/30 bg-pink-200/20 px-3 py-2 text-sm text-pink-800 shadow-lg ring-1 ring-pink-400/30 backdrop-blur-sm transition-all duration-300 ease-out dark:border-pink-500/30 dark:bg-pink-900/40 dark:text-pink-200 dark:ring-pink-500/30">
                    <p className="break-words">{name || 'No name provided'}</p>
                </div>
            )}
        </div>
    );
}
