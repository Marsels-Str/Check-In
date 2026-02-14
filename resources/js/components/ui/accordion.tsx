import { useRef, useEffect, useState } from 'react';

export interface AccordionItem {
    title: string;
    content: React.ReactNode;
}

interface AccordionProps {
    items: AccordionItem[];
    defaultOpenIndex?: number | null;
}

function AccordionItemComponent({
    isOpen,
    title,
    content,
    onToggle,
}: {
    isOpen: boolean;
    title: string;
    content: React.ReactNode;
    onToggle: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (ref.current) {
            setHeight(ref.current.scrollHeight);
        }
    }, [isOpen, content]);

    return (
        <div className="relative overflow-hidden group mt-4 rounded-md border bg-background">
            <div
                className="
                    pointer-events-none
                    absolute inset-0
                    bg-gradient-to-r from-gray-300 via-muted to-white
                    dark:bg-none
                    dark:group-hover:bg-muted
                    scale-x-0 origin-left
                    group-hover:scale-x-100
                    transition-transform duration-700 ease-out
                "
            />

            <button
                onClick={onToggle}
                className="
                    relative z-10
                    flex w-full items-center justify-between
                    p-2 text-lg font-bold
                    dark:text-white
                "
            >
                <span>{title}</span>

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 dark:text-white transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            <div
                style={{ maxHeight: isOpen ? height : 0 }}
                className="
                    relative z-10
                    overflow-hidden
                    transition-[max-height] duration-500 ease-in-out
                "
            >
                <div ref={ref}>
                    <div className="p-2 dark:text-white">
                        {content}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Accordion({
    items,
    defaultOpenIndex = null,
}: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <div>
            {items.map((item, index) => (
                <AccordionItemComponent
                    key={index}
                    isOpen={openIndex === index}
                    title={item.title}
                    content={item.content}
                    onToggle={() =>
                        setOpenIndex(openIndex === index ? null : index)
                    }
                />
            ))}
        </div>
    );
}
