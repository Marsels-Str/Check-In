import { useT } from '@/lib/t';
import { LoaderCircle } from 'lucide-react';
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const t = useT();
    
    return (
        <AuthLayout title={t('auth.verifiy.small.title')} description={t('auth.verify.small.description')}>
            <Head title={t('auth.verify.title')} />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {t('auth.verify.description')}
                </div>
            )}

            <Form method="post" action={route('verification.send')} className="space-y-6 text-center">
                {({ processing }) => (
                    <>
                        <Button
                            disabled={processing}
                            variant="secondary"
                            className="inline-flex items-center rounded-lg bg-pink-200/20 px-3.5 py-1.5 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ease-in-out ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {t('auth.verify.resend')}
                        </Button>

                        <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                            {t('auth.verify.logout')}
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
