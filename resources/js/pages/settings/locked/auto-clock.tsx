import LockedAutoClock from '@/components/profile-settings/locked-auto-clock';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function AutoClockLocked() {
    return (
        <AppLayout>
            <Head title="Auto-clock settings locked" />
            <LockedAutoClock />
        </AppLayout>
    );
}
