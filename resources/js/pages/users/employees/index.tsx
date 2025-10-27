import axios from 'axios';
import { useCan } from '@/lib/can';
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import LiveTimer from '@/components/live-timer';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem, User } from '@/types';
import EmployeeSearchAndAdd from '@/components/employees/search-and-add';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Employees', href: '/employees' }];

export default function Index({
    employees,
    currentUser,
    businesses,
    selectedBusinessId,
}: {
    employees: User[];
    currentUser: any;
    businesses: any[];
    selectedBusinessId: number | null;
}) {
    const isOwner = currentUser.roles?.some((r: any) => r.name === 'Owner');
    const canRemove = useCan('users.remove');

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

    async function handleAction(action: 'remove' | 'clockin' | 'clockout', userId: number) {
        try {
            const routes = {
                remove: route('employees.remove', userId),
                clockin: route('employees.clockin', userId),
                clockout: route('employees.clockout', userId),
            };

            const method = action === 'remove' ? 'delete' : 'post';
            const payload = action === 'remove' && isOwner ? { business_id: selectedBusinessId } : {};

            const res = await axios[method](routes[action], payload ? { data: payload } : undefined);

            if (res.data.success) {
                const msg = {
                    remove: 'Employee removed successfully.',
                    clockin: 'Employee clocked in successfully.',
                    clockout: 'Employee clocked out successfully.',
                }[action];
                setMessage(msg);
                router.reload({ only: ['employees'] });
            } else {
                setError(res.data.error || `Could not ${action} employee.`);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Unexpected error');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-gray-100">Employees</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage employees and track their working time.</p>
                </div>

                <div className="mb-6">
                    {message && (
                        <div className="mb-3 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-800 dark:bg-green-900/40 dark:text-green-200">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="mb-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-800 dark:bg-red-900/40 dark:text-red-200">{error}</div>
                    )}

                    <EmployeeSearchAndAdd
                        isOwner={isOwner}
                        businesses={businesses}
                        selectedBusinessId={selectedBusinessId}
                        onReload={() => router.reload({ only: ['employees'] })}
                    />
                </div>

                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:shadow-sm">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100/60 text-xs text-gray-600 uppercase dark:bg-[#111111]/90 dark:text-gray-300">
                                <th className="border-b border-gray-300 px-3 py-3 text-left">ID</th>
                                <th className="border-b border-gray-300 px-3 py-3 text-left">Name</th>
                                <th className="border-b border-gray-300 px-3 py-3 text-left">Clocked In</th>
                                <th className="border-b border-gray-300 px-3 py-3 text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {employees.length ? (
                                employees.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="border-b border-gray-200 text-gray-800 transition hover:bg-gray-50 dark:border-white/5 dark:text-gray-200 dark:hover:bg-white/5"
                                    >
                                        <td className="px-3 py-2 font-medium">{emp.id}</td>
                                        <td className="px-3 py-2">{emp.name}</td>
                                        <td className="px-3 py-2">
                                            {emp.time_logs?.[0]?.clock_in ? (
                                                <LiveTimer startTime={emp.time_logs[0].clock_in} />
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">—</span>
                                            )}
                                        </td>

                                        <td className="px-3 py-2">
                                            <div className="flex flex-wrap gap-2">
                                                {canRemove && (
                                                    <button
                                                        onClick={() => handleAction('remove', emp.id)}
                                                        className="rounded-md bg-red-100/20 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-red-400/30 transition-all hover:bg-red-200/30 hover:text-red-700 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-500/30 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleAction('clockin', emp.id)}
                                                    className="rounded-md bg-green-100/20 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                                                >
                                                    Clock-In
                                                </button>
                                                <button
                                                    onClick={() => handleAction('clockout', emp.id)}
                                                    className="rounded-md bg-blue-100/20 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-400/30 transition-all hover:bg-blue-200/30 hover:text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-500/30 dark:hover:bg-blue-900/30 dark:hover:text-blue-200"
                                                >
                                                    Clock-Out
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                        No employees found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
