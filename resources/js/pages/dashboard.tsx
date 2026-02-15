import { useT } from '@/lib/t';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import DashboardSlot from '@/components/dashboard/dashboard-slot';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import { defaultLayout, DashboardLayout } from '@/dashboard/registry';
import { DashboardDataProvider } from '@/components/dashboard/dashboard-data-context';
import { DashboardRenderModule } from '@/components/dashboard/dashboard-render-module';
import { BreadcrumbItem, BusinessProfile, DiagramState, EmployeeActivityPoint, MessageReminderState, OverviewData, WorkedHoursPoint } from '@/types';

interface DashboardProps {
    workedHours: DiagramState<WorkedHoursPoint>;
    activity: DiagramState<EmployeeActivityPoint>;
    overview: OverviewData;
    message: MessageReminderState;
    businesses: BusinessProfile[];
    selectedBusinessId: number | null;
}

export default function Dashboard(props: DashboardProps) {
    const canAccess = useCan('business.access');
    const [layout, setLayout] = useState<DashboardLayout>(() => {
        try {
            const saved = localStorage.getItem('dashboard-layout');
            return saved ? JSON.parse(saved) : defaultLayout;
        } catch {
            return defaultLayout;
        }
    });

    useEffect(() => {
        localStorage.setItem('dashboard-layout', JSON.stringify(layout));
    }, [layout]);

    const t = useT();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumb.dashboard'),
            href: '/dashboard'
        }
    ];

    return (
        <DashboardDataProvider
            value={{
                workedHours: props.workedHours,
                activity: props.activity,
                overview: props.overview,
                message: props.message,
            }}
        >
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={t('dashboard.view.title')} />
                <meta name="description" content="Diagrams, that lets you overview the whole business in one page" />

                <div className="flex flex-col gap-3 md:gap-4 overflow-x-auto rounded-xl p-2">
                    {canAccess && (
                        <BusinessDropdownMenu
                            businesses={props.businesses}
                            selectedBusinessId={props.selectedBusinessId ?? null}
                            onChange={(id) => router.get('/dashboard', { business_id: id }, { preserveState: true })}
                        />
                    )}

                    <div className="grid gap-2 md:grid-cols-2">
                        <div className="relative h-[25vh] min-h-[220px] max-h-[340px] overflow-hidden rounded-xl border">
                            <DashboardSlot slot="top-left" moduleId={layout['top-left']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['top-left'], 'top-left')}
                            </DashboardSlot>
                        </div>

                        <div className="relative h-[25vh] min-h-[220px] max-h-[340px] overflow-hidden rounded-xl border">
                            <DashboardSlot slot="top-right" moduleId={layout['top-right']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['top-right'], 'top-right')}
                            </DashboardSlot>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <div className="relative h-[29vh] min-h-[260px] max-h-[420px] overflow-hidden rounded-xl border">
                            <DashboardSlot slot="bottom-1" moduleId={layout['bottom-1']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['bottom-1'], 'bottom-1')}
                            </DashboardSlot>
                        </div>

                        <div className="relative h-[29vh] min-h-[260px] max-h-[420px] overflow-hidden rounded-xl border">
                            <DashboardSlot slot="bottom-2" moduleId={layout['bottom-2']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['bottom-2'], 'bottom-2')}
                            </DashboardSlot>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </DashboardDataProvider>
    );
}
