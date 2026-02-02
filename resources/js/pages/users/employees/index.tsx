import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User, BusinessProfile } from '@/types';
import EmployeeTable from '@/components/users/employees/employees-index-table';
import EmployeeSearchAndAdd from '@/components/users/employees/search-and-add';

interface Props {
    employees: User[];
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
    businessUserCount: number;
}

export default function Index({ employees, businesses, selectedBusinessId, businessUserCount }: Props) {
    const t = useT();
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.employees'),
            href: '/employees'
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('employees.index.title')} />
            <meta name="description" content="Manage your employees, add new ones or remove old ones" />

            <div className="mx-auto max-w-6xl p-4 md:p-6">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-5xl dark:text-gray-100">{t('employees.index.label')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('employees.index.text')}</p>
                </div>

                <div className="mb-6">
                    <EmployeeSearchAndAdd businesses={businesses} selectedBusinessId={selectedBusinessId} />
                </div>

                <EmployeeTable employees={employees} selectedBusinessId={selectedBusinessId} businessUserCount={businessUserCount} />
            </div>
        </AppLayout>
    );
}
