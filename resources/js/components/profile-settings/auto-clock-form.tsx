import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function AutoClockForm({ settings }: { settings: any }) {
    const [form, setForm] = useState({
        work_start: settings.work_start || '',
        work_end: settings.work_end || '',
        lunch_start: settings.lunch_start || '',
        lunch_end: settings.lunch_end || '',
    });

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const clearLunch = () => {
        setForm((prev) => ({
            ...prev,
            lunch_start: '',
            lunch_end: '',
        }));
        setMessage('Lunch time cleared.');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanedForm = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value || null]));

        try {
            const res = await axios.put(route('auto-clock.update'), cleanedForm);

            if (res.status === 200 || res.data.success) {
                setMessage('Auto Clock settings updated successfully.');
            } else {
                setError('Could not save settings.');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong.');
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
                onSubmit={handleSubmit}
                className="space-y-5 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#080808]/80 dark:shadow-sm"
            >
                <div>
                    <Label htmlFor="work_start" className="text-gray-700 dark:text-gray-300">
                        Work Start
                    </Label>
                    <Input type="time" name="work_start" id="work_start" value={form.work_start} onChange={handleChange} required />
                </div>

                <div>
                    <Label htmlFor="work_end" className="text-gray-700 dark:text-gray-300">
                        Work End
                    </Label>
                    <Input type="time" name="work_end" id="work_end" value={form.work_end} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="lunch_start" className="text-gray-700 dark:text-gray-300">
                            Lunch Start
                        </Label>
                        <Input type="time" name="lunch_start" id="lunch_start" value={form.lunch_start} onChange={handleChange} />
                    </div>

                    <div>
                        <Label htmlFor="lunch_end" className="text-gray-700 dark:text-gray-300">
                            Lunch End
                        </Label>
                        <Input type="time" name="lunch_end" id="lunch_end" value={form.lunch_end} onChange={handleChange} />
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button
                        type="button"
                        onClick={clearLunch}
                        className="rounded-lg bg-gray-200/50 px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-400/30 transition-all hover:bg-gray-300/60 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    >
                        Clear Lunch
                    </Button>

                    <Button
                        type="submit"
                        className="rounded-lg bg-pink-200/20 px-4 py-2 text-sm font-medium text-pink-700 ring-1 ring-pink-400/30 transition-all duration-300 ring-inset hover:bg-yellow-200/30 hover:text-yellow-700 hover:ring-yellow-400/30 dark:bg-pink-900/40 dark:text-pink-300 dark:ring-pink-500/30 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300 dark:hover:ring-yellow-500/30"
                    >
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    );
}
