import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, User } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    user: User;
}

export default function Show({ user }: Props) {
    const profile = user.profile || {};
    const roles = Array.isArray(user.roles) ? user.roles.map((r) => r.name).join(', ') : '—';

    // @ts-ignore nesaprotams errors, tāpēc tas tiek ignorēts
    const ownedBusiness = user.owned_business ? user.owned_business.name : null;
    const businesses = ownedBusiness || (Array.isArray(user.businesses) && user.businesses.length > 0 ? user.businesses.map((b) => b.name).join(', ') : '—');

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumb.users'), href: '/users' },
        { title: t('breadcrumb.users.show'), href: '/users' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('users.show.title')}: ${user.name}`} />
            <div className="px-4">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('users.show.label')}</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('users.show.text')}</p>
                    </div>
                    <Link
                        href={route('users.index')}
                        className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        {t('users.show.back')}
                    </Link>
                </div>

                <Card className="mx-auto max-w-3xl border border-transparent bg-white/80 shadow-md backdrop-blur-sm [border-image:linear-gradient(90deg,#FFD54F,#FF4081)_1] dark:border-white/10 dark:bg-[#080808]/80 dark:text-gray-300">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                        {profile?.portrait ? (
                            <img
                                src={profile.portrait}
                                alt={user.name}
                                className="h-24 w-24 rounded-full object-cover ring-2 ring-transparent [ring-image:linear-gradient(90deg,#FFD54F,#FF4081)_1] dark:ring-white/10"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-800 uppercase ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:ring-white/10">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-xl text-gray-900 dark:text-gray-100">{user.name}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400">{user.email}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <InfoItem label={t('users.show.business')} value={businesses} />
                            <InfoItem label={t('users.show.role')} value={roles} />
                            <InfoItem label={t('users.show.phone')} value={profile.phone} />
                            <InfoItem label={t('users.show.code')} value={profile.personal_code} />
                            <InfoItem label={t('users.show.age')} value={profile.age} />
                            <InfoItem label={t('users.show.height')} value={profile.height} />
                            <InfoItem label={t('users.show.height')} value={profile.weight} />
                            <InfoItem label={t('users.show.country')} value={profile.country} />
                            <InfoItem label={t('users.show.city')} value={profile.city} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

function InfoItem({ label, value }: { label: string; value?: string | number }) {
    return (
        <div className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{value || '—'}</span>
        </div>
    );
}
