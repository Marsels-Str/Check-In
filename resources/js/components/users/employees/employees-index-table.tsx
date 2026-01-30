import { useT } from '@/lib/t';
import { User } from '@/types';
import { useCan } from '@/lib/can';
import { Form } from '@inertiajs/react';
import LiveTimer from '@/components/live-timer';
import { Button } from '@/components/ui/button';

interface Props {
    employees: User[];
    selectedBusinessId: number | null;
    businessUserCount: number;
}

export default function EmployeeTable({ employees, businessUserCount }: Props) {
    const canRemove = useCan('employees.remove');
    const canClockIn = useCan('employees.clockIn');
    const canClockOut = useCan('employees.clockOut');
    const canAccess = useCan('business.access');

    const t = useT();

    return (
        <>
            {!canAccess && (
                    <div className="mb-4 flex items-center gap-3">
                        <div className="rounded-lg border p-3 text-sm shadow-sm bg-white/80 dark:bg-[#111]/80 dark:border-white/10">
                            <div className="text-gray-500 dark:text-gray-400">{t('employees.index.total')}</div>
                            <div className="font-medium text-gray-700 dark:text-gray-200">{businessUserCount}</div>
                        </div>
                    </div>
            )}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#0a0a0a]/80 dark:shadow-sm">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100/60 text-xs text-gray-600 uppercase dark:bg-[#111111]/90 dark:text-gray-300">
                            {canAccess && <th className="border-b px-3 py-3 text-left">{t('employees.index.id')}</th>}
                            <th className="border-b px-3 py-3 text-left">{t('employees.index.name')}</th>
                            <th className="border-b px-3 py-3 text-left">{t('employees.index.time')}</th>
                            <th className="border-b px-3 py-3 text-left">{t('employees.index.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length ? (
                            employees.map((employee: User) => (
                                <tr
                                    key={employee.id}
                                    className="border-b text-gray-800 transition hover:bg-gray-50 dark:border-white/5 dark:text-gray-200 dark:hover:bg-white/5"
                                >
                                    {canAccess && <td className="px-3 py-2 font-medium">{employee.id}</td>}
                                    <td className="px-3 py-2">{employee.name}</td>
                                    <td className="px-3 py-2">
                                        {employee.time_logs && employee.time_logs.length > 0 && employee.time_logs[0].clock_in ? (
                                            <LiveTimer startTime={employee.time_logs[0].clock_in} />
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex flex-wrap gap-2">
                                            {canRemove && (
                                                <Form method="delete" action={route('employees.remove', employee.id)}>
                                                    <Button
                                                        type="submit"
                                                        className="rounded-md bg-red-100/20 px-2.5 py-1 text-xs font-medium text-red-600 ring-1 ring-red-400/30 transition-all hover:bg-red-200/30 hover:text-red-700 dark:bg-red-900/40 dark:text-red-300 dark:ring-red-500/30 dark:hover:bg-red-900/30 dark:hover:text-red-200"
                                                    >
                                                        {t('employees.index.remove')}
                                                    </Button>
                                                </Form>
                                            )}

                                            {canClockIn && (
                                                <Form method="post" action={route('employees.clockin', employee.id)}>
                                                    <Button
                                                        type="submit"
                                                        className="rounded-md bg-green-100/20 px-2.5 py-1 text-xs font-medium text-green-700 ring-1 ring-green-400/30 transition-all hover:bg-green-200/30 hover:text-green-800 dark:bg-green-900/40 dark:text-green-300 dark:ring-green-500/30 dark:hover:bg-green-900/30 dark:hover:text-green-200"
                                                    >
                                                        {t('employees.index.in')}
                                                    </Button>
                                                </Form>
                                            )}

                                            {canClockOut && (
                                                <Form method="post" action={route('employees.clockout', employee.id)}>
                                                    <Button
                                                        type="submit"
                                                        className="rounded-md bg-blue-100/20 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-400/30 transition-all hover:bg-blue-200/30 hover:text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 dark:ring-blue-500/30 dark:hover:bg-blue-900/30 dark:hover:text-blue-200"
                                                    >
                                                        {t('employees.index.out')}
                                                    </Button>
                                                </Form>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    {t('employees.index.empty')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
