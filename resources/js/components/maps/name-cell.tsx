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
            <button type="button" onClick={() => setActiveId(isOpen ? null : id)} className="text-blue-600 hover:underline dark:text-blue-400">
                Name
            </button>

            {isOpen && (
                <div className="absolute top-1/2 left-full z-10 ml-2 w-48 -translate-y-1/2 rounded-lg bg-white p-2 text-sm text-gray-900 shadow-lg dark:bg-gray-700 dark:text-gray-100">
                    {name || 'No name provided'}
                </div>
            )}
        </div>
    );
}
