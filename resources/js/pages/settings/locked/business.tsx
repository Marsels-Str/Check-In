import LockedBusiness from '@/components/profile-settings/locked-business';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function BusinessLocked() {
    return (
        <AppLayout>
            <Head title="Business creation locked" />
            <LockedBusiness />
        </AppLayout>
    );
}
