import { useT } from '@/lib/t';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';
import { Appearance, useAppearance } from '@/hooks/use-appearance';

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance();
    
    const t = useT();

    const tabs: { value: Appearance | string; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: t('settings.appearance.light') },
        { value: 'dark', icon: Moon, label: t('settings.appearance.dark') },
        { value: 'system', icon: Monitor, label: t('settings.appearance.system') },
    ];

    return (
        <div className={cn('inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value as any)}
                    className={cn(
                        'flex items-center rounded-md px-4 py-2 transition-colors',
                        appearance === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    <Icon className="-ml-1 h-4 w-4" />
                    <span className="ml-1.5 text-sm">{label}</span>
                </button>
            ))}
        </div>
    );
}
