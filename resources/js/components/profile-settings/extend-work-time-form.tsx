import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function ExtendWorkTimeForm({ initialMinutes }: { initialMinutes: number }) {
    const [extendedMinutes, setExtendedMinutes] = useState(initialMinutes || '');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    const handleExtend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!extendedMinutes) {
            setError('Please enter a valid number of minutes.');
            return;
        }

        try {
            const res = await router.post(route('auto-clock.extend'), { extended_minutes: extendedMinutes }, { preserveScroll: true });

            setMessage('Work time extended successfully.');
        } catch (err: any) {
            setError('Something went wrong while saving extension.');
        }
    };

    return (
        <div className="mx-auto w-full max-w-lg">
            {message && (
                <div className="mb-3 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900/40 dark:text-green-200">
                    {message}
                </div>
            )}
            {error && <div className="mb-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">{error}</div>}

            <form
                onSubmit={handleExtend}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
            >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Extend Work Time</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    If you plan to work longer, you can extend your work time (up to 12 hours max).
                </p>

                <Input
                    type="number"
                    name="extended_minutes"
                    id="extended_minutes"
                    value={extendedMinutes}
                    onChange={(e) => setExtendedMinutes(e.target.value)}
                    placeholder="Enter extra minutes"
                    min={1}
                    max={720}
                />

                <div className="pt-2 text-center">
                    <Button
                        type="submit"
                        className="rounded-lg bg-green-200/20 px-4 py-2 text-sm font-medium text-green-700 ring-1 ring-green-400/30 transition-all duration-300 ring-inset hover:bg-green-200/40 hover:text-green-800 hover:ring-green-400/40 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-800/40 dark:hover:text-green-200 dark:hover:ring-green-500/30"
                    >
                        Save Extension
                    </Button>
                </div>
            </form>
        </div>
    );
}
