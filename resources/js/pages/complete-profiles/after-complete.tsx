import { useT } from '@/lib/t';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';

export default function AfterComplete() {
    function status(status: boolean) {
        router.post(route('profile.status.store'), {
            status,
        });
    }

    const t = useT();

    return (
        <>
            <Head title={t('auth.complete.after.title')} />
            <meta name="description" content="Complete your profile" />

            <div className="flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl border bg-background p-2 text-center shadow-xl">
                    <h2 className="text-xl font-bold dark:text-white">{t('auth.complete.after.label')}</h2>
                    <p className="text-muted-foreground">{t('auth.complete.after.text')}</p>

                    <div className="flex justify-center gap-2">
                        <Button variant="secondary" onClick={() => status(true)}>
                            {t('auth.complete.after.yes')}
                        </Button>

                        <Button variant="destructive" onClick={() => status(false)}>
                            {t('auth.complete.after.no')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
