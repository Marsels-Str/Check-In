import { useT } from '@/lib/t';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Head, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import ProfileCard from '@/components/profile-card';
import { BreadcrumbItem, SharedData } from '@/types';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileForm from '@/components/profile-settings/profile-form';

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const [cardOpen, setCardOpen] = useState(false);

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.profile'),
            href: '/settings/profile',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.profile.title')} />
            <meta name="description" content="Manage your profile settings and personal information" />

            <div className="relative">
                <div className="p-2 md:hidden">
                    <ProfileCard user={auth.user} />
                </div>

                {cardOpen && (
                    <div className="fixed inset-0 z-50 hidden items-center justify-center md:flex">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCardOpen(false)} />

                        <div className="relative z-10 w-full max-w-md rounded-xl">
                            <Button variant="outline" className="absolute top-2 right-10" onClick={() => setCardOpen(false)}>
                                {t('settings.profile.close')}
                            </Button>

                            <ProfileCard user={auth.user} />
                        </div>
                    </div>
                )}

                <SettingsLayout>
                    <div className="space-y-4">
                        <div className="rounded-xl border bg-background p-2 shadow-xl">
                            <div className="flex justify-between">
                                <HeadingSmall title={t('settings.profile.small.title')} description={t('settings.profile.small.description')} />

                                <Button variant="default" className="hidden md:inline-flex" onClick={() => setCardOpen(true)}>
                                    {t('settings.profile.open')}
                                </Button>
                            </div>

                            <div className="p-2">
                                <ProfileForm user={auth.user} />
                            </div>
                        </div>

                        <div className="rounded-xl border bg-red-500/20 p-2 shadow-xl dark:bg-red-600/40">
                            <DeleteUser />
                        </div>
                    </div>
                </SettingsLayout>
            </div>
        </AppLayout>
    );
}
