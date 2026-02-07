import { useT } from '@/lib/t';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, User, BusinessProfile } from '@/types';
import EmployeeSearchAndAdd from '@/components/users/employees/search-and-add';
import EmployeeMobileView from '@/components/users/employees/employees-mobile-view';
import EmployeeDesktopView from '@/components/users/employees/employees-desktop-view';

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

            <div className="space-y-4 p-2">
                <div>
                    <h1 className="text-xl font-bold dark:text-white">{t('employees.index.label')}</h1>
                    <p className="text-sm text-muted-foreground">{t('employees.index.text')}</p>
                </div>

                <EmployeeSearchAndAdd businesses={businesses} selectedBusinessId={selectedBusinessId} />

                <EmployeeMobileView employees={employees} />

                <EmployeeDesktopView employees={employees} selectedBusinessId={selectedBusinessId} businessUserCount={businessUserCount} />
            </div>
        </AppLayout>
    );
}
