import { useT } from '@/lib/t';
import { useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import HeadingSmall from '@/components/heading-small';
import SettingsLayout from '@/layouts/settings/layout';

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.settings.password'),
            href: '/settings/password',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings.password.title')} />

            <SettingsLayout>
                <div className="space-y-8">
                    <HeadingSmall title={t('settings.password.small.title')} description={t('settings.password.small.description')} />

                    <Form
                        method="put"
                        action={route('password.update')}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) passwordInput.current?.focus();
                            if (errors.current_password) currentPasswordInput.current?.focus();
                        }}
                        className="rounded-xl border border-border/40 bg-background/60 p-6 shadow-sm backdrop-blur-sm transition hover:border-border/70 dark:border-white/10 dark:bg-[#0f0f0f]/60"
                    >
                        {({ errors }) => (
                            <div className="space-y-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="current_password">{t('settings.password.current')}</Label>
                                    <Input
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        name="current_password"
                                        type="password"
                                    />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password">{t('settings.password.new')}</Label>
                                    <Input
                                        id="password"
                                        ref={passwordInput}
                                        name="password"
                                        type="password"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password_confirmation">{t('settings.password.confirm')}</Label>
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <Button
                                        className="inline-flex w-full items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                    >
                                        {t('settings.password.save')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
