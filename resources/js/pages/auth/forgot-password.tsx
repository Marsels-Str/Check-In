import { useT } from '@/lib/t';
import { Form, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function ForgotPassword() {
    const t = useT();

    return (
        <AuthLayout title={t('auth.forgot.small.title')} description={t('auth.forgot.small.description')}>
            <Head title={t('auth.forgot.title')} />
            <meta name="description" content="Request a password reset link to regain access to your account" />

            <>
                <Form method="post" action={route('password.email')}>
                    {({ errors }) => (
                        <>
                            <div>
                                <Label htmlFor="email">{t('auth.forgot.label')}</Label>
                                <Input id="email" type="email" name="email" autoComplete="off" autoFocus />

                                <InputError message={errors.email} />
                            </div>

                            <div className="mt-4 flex justify-center">
                                <Button variant="default">{t('auth.forgot.button')}</Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="text-center text-muted-foreground">
                    <span>{t('auth.forgot.return')}</span>
                    <TextLink href={route('login')}> {t('auth.forgot.login')}</TextLink>
                </div>
            </>
        </AuthLayout>
    );
}
