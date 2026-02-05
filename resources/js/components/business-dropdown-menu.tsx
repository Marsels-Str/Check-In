import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useT } from '@/lib/t';
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
    const isSelected = Boolean(currentId);

    const base =
        'inline-flex items-center justify-between rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-150 ease-out ring-1 ring-inset';

    const yellow =
        'bg-yellow-100 text-yellow-700 ring-yellow-300/50 hover:ring-2 hover:ring-yellow-400/70 dark:bg-yellow-900/30 dark:text-yellow-300 dark:ring-yellow-500/40 dark:hover:ring-yellow-400/70';

    const green =
        'bg-emerald-100 text-emerald-700 ring-emerald-300/50 hover:ring-2 hover:ring-emerald-400/70 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-500/40 dark:hover:ring-emerald-400/70';

    return (
        <div>
            {label && <p className="text-sm dark:text-white">{label}</p>}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button type="button" className={`${base} ${isSelected ? green : yellow}`}>
                        {selectedBusiness?.name || selectBusiness}
                        <ChevronDown className="ml-2 h-4 w-4 opacity-80" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align={align} className="w-56 bg-background dark:text-white">
                    <DropdownMenuLabel className="dark:text-white">{selectBusinessTitle}</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentId(null);
                            onChange(null);
                        }}
                        className="text-muted-foreground italic"
                    >
                        {t('dropdown.select.business')}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {businesses.map((b) => {
                        const active = b.id === currentId;

                        return (
                            <DropdownMenuItem
                                key={b.id}
                                onClick={() => {
                                    setCurrentId(b.id);
                                    onChange(b.id);
                                }}
                                className={`cursor-pointer transition ${
                                    active ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'hover:bg-muted'
                                }`}
                            >
                                {b.name}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
