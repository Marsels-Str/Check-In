import EmployeeSearchAndAdd from '@/components/employees/search-and-add';
import LiveTimer from '@/components/live-timer';
import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';

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

    const handleRemove = async (userId: number) => {
        try {
            const res = await axios.delete(route('users.employees.remove', userId), {
                data: isOwner ? { business_id: selectedBusinessId } : {},
            });
            if (res.data.success) router.reload();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Unexpected error');
        }
    };

    const handleClockIn = async (userId: number) => {
        try {
            const res = await axios.post(route('employees.clockin', userId));
            if (res.data.success) router.reload({ only: ['employees'] });
        } catch (err: any) {
            alert(err.response?.data?.error || 'Unexpected error');
        }
    };

    const handleClockOut = async (userId: number) => {
        try {
            const res = await axios.post(route('employees.clockout', userId));
            if (res.data.success) router.reload({ only: ['employees'] });
        } catch (err: any) {
            alert(err.response?.data?.error || 'Unexpected error');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

            <div className="mx-auto max-w-6xl p-4">
                <h1 className="mb-6 text-center text-3xl font-bold md:text-5xl">Employees</h1>

                <EmployeeSearchAndAdd
                    isOwner={isOwner}
                    businesses={businesses}
                    selectedBusinessId={selectedBusinessId}
                    onReload={() => router.reload({ only: ['employees'] })}
                />

                <div className="overflow-x-auto rounded-lg border border-gray-400 p-4">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-xs text-gray-600 uppercase dark:bg-gray-800 dark:text-gray-300">
                                <th className="border-b border-gray-400 px-3 py-2">Id</th>
                                <th className="border-b border-gray-400 px-3">Name</th>
                                <th className="border-b border-gray-400 px-3">Email</th>
                                <th className="border-b border-gray-400 px-3">Clocked In For</th>
                                <th className="border-b border-gray-400 px-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length ? (
                                employees.map((emp) => (
                                    <tr key={emp.id} className="text-center hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="border-b border-gray-400 py-2 text-gray-900 dark:text-white">{emp.id}</td>
                                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">{emp.name}</td>
                                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">{emp.email}</td>
                                        <td className="border-b border-gray-400 text-gray-900 dark:text-white">
                                            {emp.time_logs?.[0]?.clock_in ? <LiveTimer startTime={emp.time_logs[0].clock_in} /> : '-'}
                                        </td>
                                        <td className="border-b border-gray-400">
                                            {canRemove && (
                                                <button onClick={() => handleRemove(emp.id)} className="mr-3 text-red-500 hover:text-red-700">
                                                    Remove
                                                </button>
                                            )}
                                            <button onClick={() => handleClockIn(emp.id)} className="mr-3 text-green-600 hover:text-green-800">
                                                Clock In
                                            </button>
                                            <button onClick={() => handleClockOut(emp.id)} className="text-blue-600 hover:text-blue-800">
                                                Clock Out
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-6 text-center text-gray-500 dark:text-gray-400">
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
