import { Button, Dialog, DialogPanel } from '@headlessui/react';
import { router } from '@inertiajs/react';

export default function LockedAutoClock() {
    const handleBack = () => {
        if (window.history.length > 1) {
            router.visit(document.referrer || route('profile.edit'));
        } else {
            router.visit(route('dashboard'));
        }
    };

    return (
        <Dialog open={true} onClose={() => {}} className="relative z-50">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-xl dark:bg-[#121212]">
                    <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-100">Access Restricted</h2>
                    <p className="mb-6 text-gray-600 dark:text-gray-400">You must belong to a business before using Auto Clock.</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Get a job!</p>
                    <Button
                        onClick={handleBack}
                        className="rounded-lg bg-pink-200/30 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-200 ease-in-out hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Go Back
                    </Button>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
