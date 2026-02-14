import { useT } from '@/lib/t';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import BusinessCard from '@/components/business-card';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import { BreadcrumbItem, BusinessProfile } from '@/types';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import BusinessForm from '@/components/profile-settings/business-form';
import CreateBusinessForm from '@/components/profile-settings/create-business-form';

interface Props {
    business: BusinessProfile;
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
}

export default function Business({ business, businesses, selectedBusinessId }: Props) {
    function handleBusinessChange(id: number | null) {
        router.visit(route('business.edit'), {
            method: 'get',
            data: { business_id: id },
            preserveScroll: true,
            preserveState: false,
        });
    }

    const t = useT();
    const [cardOpen, setCardOpen] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.business'),
            href: '/settings/business',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.business.title')} />
            <meta name="description" content="Manage your business settings and information" />

            <div className="md:hidden">
                <BusinessCard business={business} key={business?.id} />
            </div>

            {cardOpen && (
                <div className="fixed inset-0 z-50 hidden items-center justify-center md:flex">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCardOpen(false)} />

                    <div className="relative z-10 w-full max-w-md rounded-xl">
                        <Button variant="outline" className="absolute top-2 right-10" onClick={() => setCardOpen(false)}>
                            {t('settings.profile.close')}
                        </Button>

                        <BusinessCard business={business} key={business?.id} />
                    </div>
                </div>
            )}

            <SettingsLayout>
                <div className="rounded-xl border bg-background p-2 shadow-xl">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                        <HeadingSmall title={t('settings.business.small.title')} description={t('settings.business.small.description')} />

                        <div className="flex items-center justify-end gap-2">
                            {businesses.length > 1 && (
                                <BusinessDropdownMenu
                                    businesses={businesses}
                                    selectedBusinessId={selectedBusinessId}
                                    onChange={handleBusinessChange}
                                />
                            )}

                            <Button variant="default" className="hidden md:inline-flex" onClick={() => setCardOpen(true)}>
                                {t('settings.profile.open')}
                            </Button>
                        </div>
                    </div>

                    <div>{business ? <BusinessForm key={business.id} business={business} /> : <CreateBusinessForm />}</div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
