import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import AppearanceTabs from '@/components/appearance-tabs';

export default function Appearance() {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.appearance'),
            href: '/settings/appearance',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.appearance.title')} />
            <meta name="description" content="Customize the appearance settings of your application" />

            <SettingsLayout>
                <div className="border rounded-xl bg-background shadow-xl p-2">
                    <HeadingSmall title={t('settings.appearance.small.title')} description={t('settings.appearance.small.description')} />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
