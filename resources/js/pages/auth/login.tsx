import { useT } from '@/lib/t';
import { Form, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginProps {
    canResetPassword: boolean;
}

export default function Login({ canResetPassword }: LoginProps) {
    const t = useT();

    return (
        <AuthLayout title={t('auth.login.small.title')} description={t('auth.login.small.description')}>
            <Head title={t('auth.login.title')} />
            <meta name="description" content="Login to your account to access the Check-In application" />

            <Form method="post" action={route('login')} resetOnSuccess={['password']}>
                {({ errors }) => (
                    <>
                        <div className="grid gap-2">
                            <div>
                                <Label htmlFor="email">{t('auth.login.email')}</Label>
                                <Input id="email" type="email" name="email" autoFocus tabIndex={1} autoComplete="email" />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <div className="flex items-center">
                                    <Label htmlFor="password">{t('auth.login.password')}</Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto" tabIndex={5}>
                                            {`${t('auth.login.forgot')}`}
                                        </TextLink>
                                    )}
                                </div>
                                <Input id="password" type="password" name="password" tabIndex={2} autoComplete="current-password" />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">{t('auth.login.remember')}</Label>
                            </div>

                            <Button variant="default">{t('auth.login.login')}</Button>
                        </div>

                        <div className="text-center text-muted-foreground">
                            {t('auth.login.dont')}{' '}
                            <TextLink href={route('register')} tabIndex={5}>
                                {t('auth.login.signup')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
