import { useT } from '@/lib/t';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
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
            href: '/settings/auto-clock',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.clocking.title')} />
            <meta name="description" content="Manage your auto-clock settings and work time extensions" />

            <SettingsLayout>
                <div className="rounded-xl border bg-background shadow-xl">
                    <div className="space-y-2 p-2">
                        <HeadingSmall title={t('settings.clocking.small.title')} description={t('settings.clocking.small.description')} />

                        <AutoClockForm settings={settings} />
                    </div>
                </div>

                <ExtendWorkTimeForm initialMinutes={settings.extended_minutes} />

                {!hasBusiness && <LockedAutoClock />}
            </SettingsLayout>
        </AppLayout>
    );
}
