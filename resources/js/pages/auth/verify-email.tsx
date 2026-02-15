import { useT } from '@/lib/t';
import { Form, Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import AuthLayout from '@/layouts/auth-layout';
import { Button } from '@/components/ui/button';

export default function VerifyEmail() {
    const t = useT();

    return (
        <AuthLayout title={t('auth.verifiy.small.title')} description={t('auth.verify.small.description')}>
            <Head title={t('auth.verify.title')} />
            <meta name="description" content="Verify your email address" />

            <Form method="post" action={route('verification.send')} className="space-y-4 text-center">
                <>
                    <Button variant="secondary">{t('auth.verify.resend')}</Button>

                    <TextLink href={route('logout')} method="post" className="mx-auto block">
                        {t('auth.verify.logout')}
                    </TextLink>
                </>
            </Form>
        </AuthLayout>
    );
}
