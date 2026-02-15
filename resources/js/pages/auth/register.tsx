import { useT } from '@/lib/t';
import TextLink from '@/components/text-link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, Head } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function Register() {
    const t = useT();

    return (
        <AuthLayout title={t('auth.register.small.title')} description={t('auth.register.small.description')}>
            <Head title={t('auth.register.title')} />
            <meta name="description" content="Create a new account to start using the Check-In application" />

            <Form method="post" action={route('register')} resetOnSuccess={['password', 'password_confirmation']} disableWhileProcessing>
                {({ errors }) => (
                    <>
                        <div className="grid gap-2">
                            <div>
                                <Label htmlFor="name">{t('auth.register.name')}</Label>
                                <Input id="name" type="text" autoFocus autoComplete="name" name="name" />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <Label htmlFor="email">{t('auth.register.email')}</Label>
                                <Input id="email" autoComplete="email" name="email" />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password">{t('auth.register.password')}</Label>
                                <Input id="password" type="password" autoComplete="new-password" name="password" />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation">{t('auth.register.password.confirm')}</Label>
                                <Input id="password_confirmation" type="password" autoComplete="new-password" name="password_confirmation" />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit">{t('auth.register.create')}</Button>
                        </div>

                        <div className="text-center text-muted-foreground">
                            {t('auth.register.already')}{' '}
                            <TextLink href={route('login')} tabIndex={6}>
                                {t('auth.register.login')}
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
