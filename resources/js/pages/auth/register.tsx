import { useT } from '@/lib/t';
import { LoaderCircle } from 'lucide-react';
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
            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('auth.register.name')}</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('auth.register.email')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">{t('auth.register.password')}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">{t('auth.register.password.confirm')}</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                tabIndex={5}
                            >
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                {t('auth.register.create')}
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            {t('auth.register.already')} {' '}
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
