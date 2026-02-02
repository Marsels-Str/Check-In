import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import ProfileCard from '@/components/profile-card';
import { BreadcrumbItem, SharedData } from '@/types';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileForm from '@/components/profile-settings/profile-form';

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.profile'),
            href: '/settings/profile'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.profile.title')} />
            <meta name="description" content="Manage your profile settings and personal information" />

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
                            <HeadingSmall title={t('settings.profile.small.title')} description={t('settings.profile.small.description')} />
                            <div className="mt-6">
                                <ProfileForm user={auth.user} />
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
