import EmployeeTable from '@/components/users/employees/employees-index-table';
import EmployeeSearchAndAdd from '@/components/users/employees/search-and-add';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Employees', href: '/employees' }];

export default function Index({
    employees,
    businesses,
    selectedBusinessId,
}: {
    employees: User[];
    businesses: any[];
    selectedBusinessId: number | null;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees" />

            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-gray-100">Employees</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage employees and track their working time.</p>
                </div>

                <div className="mb-6">
                    <EmployeeSearchAndAdd businesses={businesses} selectedBusinessId={selectedBusinessId} />
                </div>

                <EmployeeTable employees={employees} selectedBusinessId={selectedBusinessId} />
            </div>
        </AppLayout>
    );
}
