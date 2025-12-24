import BusinessCard from '@/components/business-card';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import HeadingSmall from '@/components/heading-small';
import BusinessForm from '@/components/profile-settings/business-form';
import CreateBusinessForm from '@/components/profile-settings/create-business-form';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Business settings', href: '/settings/business' }];

export default function Business({
    business,
    businesses = [],
    selectedBusinessId,
}: {
    business?: any;
    businesses?: any[];
    selectedBusinessId?: number | string | null;
}) {
    function handleBusinessChange(id: number | string | null) {
        router.visit(route('business.edit'), {
            method: 'get',
            data: { business_id: id },
            preserveScroll: true,
            preserveState: false,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Business settings" />

            <div className="relative">
                <div className="relative">
                    <div className="mb-4 px-3 py-2 md:hidden">
                        <BusinessCard business={business} key={business?.id} />
                    </div>
                    <div className="absolute top-4 right-6 hidden md:block">
                        <BusinessCard business={business} key={business?.id} />
                    </div>
                </div>

                <SettingsLayout>
                    <div className="space-y-12">
                        <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0f0f0f]/70">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <HeadingSmall title="Business information" description="Update your business details, contact info, and logo." />
                                </div>
                                {businesses.length > 1 && (
                                    <BusinessDropdownMenu
                                        businesses={businesses}
                                        selectedBusinessId={selectedBusinessId ?? null}
                                        onChange={handleBusinessChange}
                                    />
                                )}
                            </div>

                            {business ? (
                                <BusinessForm key={business.id} business={business} action={route('business.update')} />
                            ) : (
                                <CreateBusinessForm />
                            )}
                        </div>
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
