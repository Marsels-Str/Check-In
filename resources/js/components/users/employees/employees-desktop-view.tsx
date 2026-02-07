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

export default function EmployeeDesktopView({ employees, businessUserCount }: Props) {
    const canRemove = useCan('employees.remove');
    const canClockIn = useCan('employees.clockIn');
    const canClockOut = useCan('employees.clockOut');
    const canAccess = useCan('business.access');

    const t = useT();

    return (
        <>
            <div className="mx-auto hidden max-w-2xl overflow-x-auto rounded-xl border shadow-xl md:block">
                <table className="min-w-full divide-y">
                    <thead>
                        <tr className="bg-muted dark:text-white">
                            {canAccess && <th className="px-4 py-2 text-left">{t('employees.index.id')}</th>}
                            <th className="px-4 py-2 text-left">{t('employees.index.name')}</th>
                            <th className="px-4 py-2 text-left">{t('employees.index.time')}</th>
                            <th className="px-4 py-2 text-right">{t('employees.index.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {employees.length ? (
                            employees.map((employee: User) => (
                                <tr key={employee.id} className="hover:bg-muted">
                                    {canAccess && <td className="px-4 py-2">{employee.id}</td>}
                                    <td className="px-4 py-2">{employee.name}</td>
                                    <td className="px-4 py-2">
                                        {employee.time_logs && employee.time_logs.length > 0 && employee.time_logs[0].clock_in ? (
                                            <LiveTimer startTime={employee.time_logs[0].clock_in} />
                                        ) : (
                                            <span className="text-muted-foreground">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2">
                                        <div className="flex justify-end space-x-2">
                                            {canRemove && (
                                                <Form method="delete" action={route('employees.remove', employee.id)}>
                                                    <Button variant="destructive">{t('employees.index.remove')}</Button>
                                                </Form>
                                            )}

                                            {canClockIn && (
                                                <Form method="post" action={route('employees.clockin', employee.id)}>
                                                    <Button variant="default">{t('employees.index.in')}</Button>
                                                </Form>
                                            )}

                                            {canClockOut && (
                                                <Form method="post" action={route('employees.clockout', employee.id)}>
                                                    <Button variant="destructive">{t('employees.index.out')}</Button>
                                                </Form>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-2 py-4 text-center text-muted-foreground">
                                    {t('employees.index.empty')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {!canAccess && (
                <div className="flex justify-center">
                    <div className="rounded-lg border bg-muted p-2 shadow-md">
                        <div className="text-muted-foreground">{t('employees.index.total')}</div>
                        <div className="dark:text-white">{businessUserCount}</div>
                    </div>
                </div>
            )}
        </>
    );
}
