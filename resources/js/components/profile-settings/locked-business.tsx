import { useT } from '@/lib/t';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogPanel } from '@headlessui/react';

export default function LockedBusiness() {
    const handleBack = () => {
        if (window.history.length > 1) {
            router.visit(document.referrer || route('profile.edit'));
        } else {
            router.visit(route('dashboard'));
        }
    };

    const t = useT();

    return (
        <Dialog open={true} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center">
                <DialogPanel className="mx-auto max-w-md rounded-xl border bg-background p-2 text-center">
                    <h2 className="text-lg font-bold dark:text-white">{t('settings.business.locked.label')}</h2>
                    <p className="mb-4 text-muted-foreground">{t('settings.business.locked.text.1')}</p>
                    <p className="text-muted-foreground">{t('settings.business.locked.text.2')}</p>
                    <Button variant="outline" onClick={handleBack}>
                        {t('settings.business.locked.back')}
                    </Button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
