import { usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Flash = {
    success?: string;
    error?: string;
};

export default function FlashMessages() {
    const { flash } = usePage<{ flash?: Flash }>().props;

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [type, setType] = useState<'success' | 'error' | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        }

        if (flash?.success || flash?.error) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [flash?.success, flash?.error]);

    if (!visible || !message || !type) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-6 right-6 z-50 w-[360px] animate-in fade-in slide-in-from-top-2">
            <div
                className={`flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur transition-all duration-300 ${
                    isSuccess
                        ? 'border-green-300 bg-green-100/80 text-green-900 dark:border-green-600 dark:bg-green-900/40 dark:text-green-200'
                        : 'border-red-300 bg-red-100/80 text-red-900 dark:border-red-600 dark:bg-red-900/40 dark:text-red-200'
                } `}
            >
                <div className="mt-0.5">{isSuccess ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}</div>

                <div className="flex-1 text-sm leading-relaxed font-medium">{message}</div>

                <button onClick={() => setVisible(false)} className="opacity-60 transition hover:opacity-100" aria-label="Close notification">
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
