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

            <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
                <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/80 p-8 text-center shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm">
                    <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('auth.complete.after.label')}</h2>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                        {t('auth.complete.after.text')}
                    </p>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => status(true)}
                            className="rounded-lg bg-pink-200/20 px-5 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                        >
                            {t('auth.complete.after.yes')}
                        </Button>

                        <Button
                            onClick={() => status(false)}
                            className="rounded-lg bg-gray-200/60 px-5 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300/50 transition-all duration-300 hover:bg-gray-300/60 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700/60 dark:hover:text-white"
                        >
                            {t('auth.complete.after.no')}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
