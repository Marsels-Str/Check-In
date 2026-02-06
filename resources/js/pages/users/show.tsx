import { useT } from '@/lib/t';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
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

    const usersBack = () => {
        router.get(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('users.show.title')}: ${user.name}`} />
            <meta name="description" content="View user details and manage user information" />
            
            <div className="space-y-2 p-2">
                <div className="flex justify-between">
                    <div>
                        <h1 className="text-xl font-bold dark:text-white">{t('users.show.label')}</h1>
                        <p className="text-sm text-muted-foreground">{t('users.show.text')}</p>
                    </div>
                    <Button variant="outline" onClick={() => usersBack()}>
                        {t('users.show.back')}
                    </Button>
                </div>

                <Card className="mx-auto max-w-xl border shadow-xl">
                    <CardHeader className="flex sm:flex-row sm:items-center">
                        {profile?.portrait ? (
                            <img
                                src={profile.portrait}
                                alt={user.name}
                                className="h-24 w-24"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200 text-2xl text-gray-800 uppercase ring-1 ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:ring-white/10">
                                {user.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <CardTitle className="text-xl dark:text-white">{user.name}</CardTitle>
                            <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid grid-cols-1 space-y-4 sm:grid-cols-2">
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
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="dark:text-white">{value || '—'}</span>
        </div>
    );
}
