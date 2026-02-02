import { useT } from '@/lib/t';
import { LoaderCircle } from 'lucide-react';
import { Form, Head } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';

export default function ForgotPassword({ status }: { status?: string }) {
    const t = useT();
    
    return (
        <AuthLayout title={t('auth.forgot.small.title')} description={t('auth.forgot.small.description')}>
            <Head title={t('auth.forgot.title')} />
            <meta name="description" content="Request a password reset link to regain access to your account" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}

            <div className="space-y-6">
                <Form method="post" action={route('password.email')}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email">{t('auth.forgot.label')}</Label>
                                <Input id="email" type="email" name="email" autoComplete="off" autoFocus />

                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6 flex items-center justify-start">
                                <Button
                                    className="inline-flex items-center w-full rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {t('auth.forgot.button')}
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-muted-foreground">
                    <span>{t('auth.forgot.return')}</span>
                    <TextLink href={route('login')}>{t('auth.forgot.login')}</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
