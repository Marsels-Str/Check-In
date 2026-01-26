import { useT } from '@/lib/t';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BusinessProfile } from '@/types';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
    onChange: (id: number | null) => void;
    label?: string;
    align?: 'start' | 'center' | 'end';
}

export default function BusinessDropdownMenu({ businesses, selectedBusinessId, onChange, label, align = 'end' }: Props) {
    const [currentId, setCurrentId] = useState<number | null>(selectedBusinessId);
    
    const t = useT();

    const selectBusiness = t('dropdown.select.business');
    const selectBusinessTitle = t('dropdown.select.business.title');

    useEffect(() => {
        setCurrentId(selectedBusinessId);
    }, [selectedBusinessId]);

    const selectedBusiness = businesses.find((b) => String(b.id) === String(currentId));

    return (
        <div className="space-y-1">
            {label && <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex items-center justify-between rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {selectedBusiness?.name || selectBusiness}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-80" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align={align} className="w-56 bg-white dark:bg-[#0d0d0d]/90 dark:text-gray-100">
                    <DropdownMenuLabel className="text-gray-600 dark:text-gray-400">{selectBusinessTitle}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />

                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentId(null);
                            onChange(null);
                        }}
                        className="text-gray-500 italic"
                    >
                       {t('dropdown.select.business')}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {businesses.map((b) => (
                        <DropdownMenuItem
                            key={b.id}
                            onClick={() => {
                                setCurrentId(b.id);
                                onChange(b.id);
                            }}
                            className={`cursor-pointer ${
                                (b.id) === (currentId) ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : ''
                            }`}
                        >
                            {b.name}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
