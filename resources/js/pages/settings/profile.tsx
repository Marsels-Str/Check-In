import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import IDCard from '@/components/id-card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { router } from '@inertiajs/react';

import BusinessForm from '@/pages/settings/business-form';
import ProfileForm from '@/pages/settings/profile-form';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

export default function Profile({ mustVerifyEmail, status, business, businesses, selectedBusinessId }: { mustVerifyEmail: boolean; status?: string, business?: any, businesses?: any, selectedBusinessId?: any }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            {business && (
                <div className="space-y-6">
                    <HeadingSmall title="Business information" description="Update your business profile" />

                    {businesses?.length > 1 && (
                        <select
                            value={selectedBusinessId || ''}
                            onChange={(e) => {
                                router.get(route('business.complete'), { business_id: e.target.value })
                            }}
                            className="rounded border p-2 mb-4"
                        >
                            {businesses.map((b: any) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    )}

                    <BusinessForm business={business} action={route('business.update')} />
                </div>
            )}

            <div className="relative">
                <div className="px-2 py-2 md:hidden">
                    <IDCard user={auth.user} />
                </div>
                <div className="absolute top-0 right-0 hidden px-2 py-6 md:block">
                    <IDCard user={auth.user} />
                </div>

                <SettingsLayout>
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <HeadingSmall title="Profile information" description="Update your personal info" />
                            <ProfileForm user={auth.user} mustVerifyEmail={mustVerifyEmail} status={status} />
                        </div>

                        {(auth.user.roles.includes('Owner') || auth.user.roles.includes('Business')) && auth.user.business && (
                            <div className="space-y-6">
                                <HeadingSmall title="Business information" description="Update your business profile" />
                                <BusinessForm business={auth.user.business} action={route('business.update')} />
                            </div>
                        )}

                        <DeleteUser />
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
