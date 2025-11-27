import LiveTimer from '@/components/live-timer';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

export default function EmployeeTable({
    employees,
    canRemove,
    isOwner,
    selectedBusinessId,
    onMessage,
    onError,
}: {
    employees: any[];
    canRemove: boolean;
    isOwner: boolean;
    selectedBusinessId: number | null;
    onMessage: (msg: string) => void;
    onError: (msg: string) => void;
}) {
    const [loadingId, setLoadingId] = useState<number | null>(null);

    async function handleAction(action: 'remove' | 'clockin' | 'clockout', userId: number) {
        try {
            setLoadingId(userId);

            const routes = {
                remove: route('employees.remove', userId),
                clockin: route('employees.clockin', userId),
                clockout: route('employees.clockout', userId),
            };

            const method = action === 'remove' ? 'delete' : 'post';
            const payload = action === 'remove' && isOwner ? { business_id: selectedBusinessId } : {};

            const res = await axios[method](routes[action], payload ? { data: payload } : undefined);

            if (res.data.success) {
                onMessage(
                    {
                        remove: 'Employee removed successfully.',
                        clockin: 'Employee clocked in successfully.',
                        clockout: 'Employee clocked out successfully.',
                    }[action],
                );
                router.reload({ only: ['employees'] });
            } else {
                onError(res.data.error || `Could not ${action} employee.`);
            }
        } catch (err: any) {
            onError(err.response?.data?.error || 'Unexpected error');
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:shadow-sm">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="bg-gray-100/60 text-xs text-gray-600 uppercase dark:bg-[#111111]/90 dark:text-gray-300">
                        <th className="border-b px-3 py-3 text-left">ID</th>
                        <th className="border-b px-3 py-3 text-left">Name</th>
                        <th className="border-b px-3 py-3 text-left">Clocked In</th>
                        <th className="border-b px-3 py-3 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.length ? (
                        employees.map((emp) => (
                            <tr
                                key={emp.id}
                                className="border-b text-gray-800 transition hover:bg-gray-50 dark:border-white/5 dark:text-gray-200 dark:hover:bg-white/5"
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
                                                disabled={loadingId === emp.id}
                                                onClick={() => handleAction('remove', emp.id)}
                                                className="rounded-md bg-red-100/20 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-red-400/30 transition-all hover:bg-red-200/30 hover:text-red-700 disabled:opacity-60 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-500/30 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                                            >
                                                Remove
                                            </button>
                                        )}
                                        <button
                                            disabled={loadingId === emp.id}
                                            onClick={() => handleAction('clockin', emp.id)}
                                            className="rounded-md bg-green-100/20 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 disabled:opacity-60 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                                        >
                                            Clock-In
                                        </button>
                                        <button
                                            disabled={loadingId === emp.id}
                                            onClick={() => handleAction('clockout', emp.id)}
                                            className="rounded-md bg-blue-100/20 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-400/30 transition-all hover:bg-blue-200/30 hover:text-blue-800 disabled:opacity-60 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-500/30 dark:hover:bg-blue-900/30 dark:hover:text-blue-200"
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
    );
}
