import { useCan } from '@/lib/can';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import OverviewCard from '@/components/diagrams/overview';
import WorkedHoursDiagram from '@/components/diagrams/worked-hours';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import MessageReminderDiagram from '@/components/diagrams/message-reminder';
import EmployeeActivityDiagram from '@/components/diagrams/active-employees';
import type { BreadcrumbItem, DiagramState, WorkedHoursPoint, BusinessProfile, EmployeeActivityPoint, OverviewData, MessageReminderState } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    workedHours: DiagramState<WorkedHoursPoint>;
    activity: DiagramState<EmployeeActivityPoint>;
    overview: OverviewData;
    message: MessageReminderState;
    businesses: BusinessProfile[];
    selectedBusinessId?: number | null;
}

export default function Dashboard({workedHours, activity, overview, message, businesses, selectedBusinessId,}: DashboardProps) {
    const canAccess = useCan('business.access');
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {canAccess && (
                    <BusinessDropdownMenu
                        businesses={businesses}
                        selectedBusinessId={selectedBusinessId ?? null}
                        onChange={(id) =>
                            router.get('/dashboard', { business_id: id }, { preserveState: true })
                        }
                    />
                )}

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border dark:bg-[#D4A017]/40">
                        <OverviewCard {...overview} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border dark:bg-[#D4A017]/40">
                        <EmployeeActivityDiagram {...activity} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        
                        <MessageReminderDiagram {...message} />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <WorkedHoursDiagram {...workedHours} />
                </div>
            </div>
        </AppLayout>
    );
}
