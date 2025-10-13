import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import ProfileCard from '@/components/profile-card';
import ProfileForm from '@/components/profile-settings/profile-form';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Profile settings', href: '/settings/profile' }];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <div className="relative">
                <div className="mb-4 px-3 py-2 md:hidden">
                    <ProfileCard user={auth.user} />
                </div>

                <div className="absolute top-4 right-6 hidden md:block">
                    <ProfileCard user={auth.user} />
                </div>

                <SettingsLayout>
                    <div className="space-y-12">
                        <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0f0f0f]/70">
                            <HeadingSmall title="Profile information" description="Update your personal details and contact information." />
                            <div className="mt-6">
                                <ProfileForm user={auth.user} mustVerifyEmail={mustVerifyEmail} status={status} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-red-200/50 bg-red-200/60 p-6 shadow-sm dark:border-red-900/30 dark:bg-red-900/10">
                            <DeleteUser />
                        </div>
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
