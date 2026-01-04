import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, DiagramState, WorkedHoursPoint, BusinessProfile, EmployeeActivityPoint, OverviewData } from '@/types';
import { Head } from '@inertiajs/react';
import WorkedHoursDiagram from '@/components/diagrams/worked-hours';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import { router } from '@inertiajs/react';
import { useCan } from '@/lib/can';
import EmployeeActivityDiagram from '@/components/diagrams/active-employees';
import OverviewCard from '@/components/diagrams/overview';
import MessageReminderDiagram from '@/components/diagrams/message-reminder';

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
    messageReminders: {
        data: {
            group_id: number;
            group_name: string;
            unread_count: number;
            has_unread: boolean;
        }[];
        empty?: string;
    };
    businesses: BusinessProfile[];
    selectedBusinessId?: number | null;
}

export default function Dashboard({workedHours, activity, overview, messageReminders, businesses, selectedBusinessId,}: DashboardProps) {
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
                        <WorkedHoursDiagram {...workedHours} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border dark:bg-[#D4A017]/40">
                        <EmployeeActivityDiagram {...activity} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <OverviewCard {...overview} />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <MessageReminderDiagram messageReminders={messageReminders} />
                </div>
            </div>
        </AppLayout>
    );
}
