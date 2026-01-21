import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LockedBusiness from '@/components/profile-settings/locked-business';

export default function BusinessLocked() {
    const t = useT();
    
    return (
        <AppLayout>
            <Head title={t('settings.business.locked.title')} />
            <LockedBusiness />
        </AppLayout>
    );
}
