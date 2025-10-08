import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Auto Clock',
        href: '/settings/auto-clock',
    },
];

export default function AutoClock() {
    const { props }: any = usePage();
    const settings = props.settings || {};
    const [form, setForm] = useState({
        work_start: settings.work_start || '',
        work_end: settings.work_end || '',
        lunch_start: settings.lunch_start || '',
        lunch_end: settings.lunch_end || '',
        timezone: settings.timezone || 'Europe/Riga',
    });
    const [extendedMinutes, setExtendedMinutes] = useState(settings.extended_minutes || '');
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await router.post(route('settings.auto-clock.store'), form, {
                preserveScroll: true,
                onSuccess: () => setSuccess('Settings updated successfully!'),
                onError: (errors) => setError(Object.values(errors)[0] as string),
            });
        } catch {
            setError('Something went wrong.');
        }
    };

    const handleExtend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!extendedMinutes) {
            setError('Please enter how many minutes to extend.');
            return;
        }
        try {
            await router.post(
                route('settings.auto-clock.extend'),
                { extended_minutes: extendedMinutes },
                {
                    preserveScroll: true,
                    onSuccess: () => setSuccess('Extended time saved successfully!'),
                    onError: (errors) => setError(Object.values(errors)[0] as string),
                },
            );
        } catch {
            setError('Something went wrong.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
        <SettingsLayout>
            <Head title="Auto Clock Settings" />
            <h1 className="mb-4 text-2xl font-bold">Auto Clock Settings</h1>

            {success && <p className="mb-4 text-green-600">{success}</p>}
            {error && <p className="mb-4 text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="max-w-md space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Work Start</label>
                    <input
                        type="time"
                        name="work_start"
                        value={form.work_start}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Work End</label>
                    <input
                        type="time"
                        name="work_end"
                        value={form.work_end}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lunch Start</label>
                        <input
                            type="time"
                            name="lunch_start"
                            value={form.lunch_start}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Lunch End</label>
                        <input
                            type="time"
                            name="lunch_end"
                            value={form.lunch_end}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Timezone</label>
                    <select
                        name="timezone"
                        value={form.timezone}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                        <option value="Europe/Riga">Europe/Riga (Your local time)</option>
                        <option value="UTC">UTC</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                </div>

                <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Save Settings
                </button>
            </form>

            <hr className="my-8" />

            <form onSubmit={handleExtend} className="max-w-md space-y-4">
                <h2 className="text-lg font-semibold">Extend Work Time</h2>
                <p className="text-sm text-gray-600">If you plan to work longer, you can extend your work time (up to 12 hours max).</p>

                <input
                    type="number"
                    name="extended_minutes"
                    value={extendedMinutes}
                    onChange={(e) => setExtendedMinutes(e.target.value)}
                    placeholder="Enter extra minutes"
                    className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min={1}
                    max={720}
                />

                <button type="submit" className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700">
                    Save Extension
                </button>
            </form>
        </SettingsLayout>
        </AppLayout>
    );
}
