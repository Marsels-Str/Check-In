import { useT } from '@/lib/t';
import { User } from '@/types';
import { useCan } from '@/lib/can';
import { Form } from '@inertiajs/react';
import LiveTimer from '@/components/live-timer';
import { Button } from '@/components/ui/button';

interface Props {
    employees: User[];
}

export default function EmployeeMobileView({ employees }: Props) {
    const canRemove = useCan('employees.remove');
    const canClockIn = useCan('employees.clockIn');
    const canClockOut = useCan('employees.clockOut');
    const canAccess = useCan('business.access');

    const t = useT();

    if (!employees.length) {
        return <div className="rounded-xl border px-4 py-2 text-center text-muted-foreground italic md:hidden">{t('employees.index.empty')}</div>;
    }

    return (
        <div className="space-y-3 md:hidden">
            {employees.map((employee: User) => (
                <div key={employee.id} className="rounded-xl border bg-background p-4 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold dark:text-white">{employee.name}</div>
                            {canAccess && (
                                <div className="text-xs text-muted-foreground">
                                    {t('employees.index.id')}: {employee.id}
                                </div>
                            )}
                        </div>

                        <div className="text-sm">
                            {employee.time_logs?.[0]?.clock_in ? (
                                <LiveTimer startTime={employee.time_logs[0].clock_in} />
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
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
                </div>
            ))}
        </div>
    );
}
