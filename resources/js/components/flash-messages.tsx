import { useT } from '@/lib/t';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

type FlashPayload = {
    text: string;
    id: string;
};

type Flash = {
    success?: FlashPayload | null;
    error?: FlashPayload | null;
};

type FlashMessage = {
    id: number;
    type: 'success' | 'error';
    text: string;
};

const TTL = 3000;

export default function FlashMessages() {
    const { flash } = usePage<{ flash?: Flash }>().props;
    const [queue, setQueue] = useState<FlashMessage[]>([]);
    const timers = useRef<number[]>([]);

    const t = useT();

    useEffect(() => {
        if (flash?.success) push('success', flash.success.text);
        if (flash?.error) push('error', flash.error.text);
    }, [flash?.success?.id, flash?.error?.id]);

    const push = (type: 'success' | 'error', text: string) => {
        const id = Date.now() + Math.random();
        setQueue((q) => [...q, { id, type, text }]);

        const timer = window.setTimeout(() => remove(id), TTL);
        timers.current.push(timer);
    };

    const remove = (id: number) => {
        setQueue((q) => q.filter((m) => m.id !== id));
    };

    useEffect(() => {
        return () => {
            timers.current.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
            {queue.map((msg) => (
                <div
                    key={msg.id}
                    className={`relative overflow-hidden rounded-xl border p-4 shadow-lg backdrop-blur transition-all ${
                        msg.type === 'success'
                            ? 'border-green-300 text-green-900 dark:border-green-600 dark:text-green-200'
                            : 'border-red-300 text-red-900 dark:border-red-600 dark:text-red-200'
                    }`}
                >
                    <div className="absolute inset-0 bg-gray-200/40 dark:bg-gray-700/40" />

                    <div
                        className={`absolute inset-y-0 left-0 transition-[animation-play-state] hover:[animation-play-state:paused] ${
                            msg.type === 'success' ? 'bg-green-400/30' : 'bg-red-400/30'
                        }`}
                        style={{
                            width: '0%',
                            animation: `fill ${TTL}ms linear forwards`,
                        }}
                    />

                    <div className="relative flex items-start gap-3">
                        <div className="mt-0.5">
                            {msg.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                        </div>

                        <div className="flex-1 text-sm leading-relaxed font-medium">{t(msg.text)}</div>

                        <button onClick={() => remove(msg.id)} className="opacity-60 transition hover:opacity-100">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            ))}

            <style>
                {`
                @keyframes fill {
                    from { width: 0%; }
                    to { width: 100%; }
                }
                `}
            </style>
        </div>
    );
}
