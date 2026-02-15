import { useT } from '@/lib/t';
import { useRef } from 'react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
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
            <meta name="description" content="Manage your password settings and update your password" />

            <SettingsLayout>
                <div className="rounded-xl border bg-background p-2 shadow-xl space-y-2">
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
                    >
                        {({ errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="current_password">{t('settings.password.current')}</Label>
                                    <Input id="current_password" ref={currentPasswordInput} name="current_password" type="password" />
                                    <InputError message={errors.current_password} />
                                </div>

                                <div>
                                    <Label htmlFor="password">{t('settings.password.new')}</Label>
                                    <Input id="password" ref={passwordInput} name="password" type="password" />
                                    <InputError message={errors.password} />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">{t('settings.password.confirm')}</Label>
                                    <Input id="password_confirmation" name="password_confirmation" type="password" />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div className="mt-4 flex justify-between">
                                    <Button variant="default" className="w-full">
                                        {t('settings.password.save')}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
