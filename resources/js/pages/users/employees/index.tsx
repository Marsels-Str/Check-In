import EmployeeTable from '@/components/users/employees/employees-index-table';
import EmployeeSearchAndAdd from '@/components/users/employees/search-and-add';
import AppLayout from '@/layouts/app-layout';
import { useCan } from '@/lib/can';
import { type BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

                <EmployeeTable
                    employees={employees}
                    canRemove={canRemove}
                    isOwner={isOwner}
                    selectedBusinessId={selectedBusinessId}
                    onMessage={setMessage}
                    onError={setError}
                />
            </div>
        </AppLayout>
    );
}
