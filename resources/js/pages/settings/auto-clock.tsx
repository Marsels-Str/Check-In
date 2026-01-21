import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import AutoClockForm from '@/components/profile-settings/auto-clock-form';
import LockedAutoClock from '@/components/profile-settings/locked-auto-clock';
import ExtendWorkTimeForm from '@/components/profile-settings/extend-work-time-form';

export default function AutoClock() {
    const { props }: any = usePage();
    const { settings = {}, hasBusiness } = props;

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.clocking'),
            href: '/settings/auto-clock'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <Head title={t('settings.clocking.title')} />

                <div className="space-y-8">
                <HeadingSmall title={t('settings.clocking.small.title')} description={t('settings.clocking.small.description')} />

                    <AutoClockForm settings={settings} />

                    <hr className="my-10 border-gray-300 dark:border-gray-700" />

                    <ExtendWorkTimeForm initialMinutes={settings.extended_minutes} />

                    {!hasBusiness && <LockedAutoClock />}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
