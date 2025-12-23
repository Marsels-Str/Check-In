import AutoClockForm from '@/components/profile-settings/auto-clock-form';
import ExtendWorkTimeForm from '@/components/profile-settings/extend-work-time-form';
import LockedAutoClock from '@/components/profile-settings/locked-auto-clock';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Auto Clock', href: '/settings/auto-clock' }];

export default function AutoClock() {
    const { props }: any = usePage();
    const { settings = {}, hasBusiness } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title="Auto Clock Settings" />

                <div className="px-4 py-8">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Auto Clock Settings</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Configure automatic work and lunch.</p>
                    </div>

                    <AutoClockForm settings={settings} />

                    <hr className="my-10 border-gray-300 dark:border-gray-700" />

                    <ExtendWorkTimeForm initialMinutes={settings.extended_minutes} />

                    {!hasBusiness && <LockedAutoClock />}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
