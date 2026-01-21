import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LockedAutoClock from '@/components/profile-settings/locked-auto-clock';

export default function AutoClockLocked() {
    const t = useT();
    
    return (
        <AppLayout>
            <Head title={t('settings.clocking.locked.title')} />
            <LockedAutoClock />
        </AppLayout>
    );
}
