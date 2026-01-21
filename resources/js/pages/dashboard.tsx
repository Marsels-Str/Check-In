import { useT } from '@/lib/t';
import { useState } from 'react';
import { useEffect } from 'react';
import { useCan } from '@/lib/can';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import DashboardSlot from '@/components/dashboard/dashboard-slot';
import BusinessDropdownMenu from '@/components/business-dropdown-menu';
import { defaultLayout, type DashboardLayout } from '@/dashboard/registry';
import { DashboardDataProvider } from '@/components/dashboard/dashboard-data-context';
import { DashboardRenderModule } from '@/components/dashboard/dashboard-render-module';
import type { BreadcrumbItem, BusinessProfile, DiagramState, EmployeeActivityPoint, MessageReminderState, OverviewData, WorkedHoursPoint } from '@/types';

interface DashboardProps {
    workedHours: DiagramState<WorkedHoursPoint>;
    activity: DiagramState<EmployeeActivityPoint>;
    overview: OverviewData;
    message: MessageReminderState;
    businesses: BusinessProfile[];
    selectedBusinessId?: number | null;
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

    const breadcrumbs: BreadcrumbItem[] = [{ title: t('breadcrumb.dashboard'), href: '/dashboard' }];

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

                <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                    {canAccess && (
                        <BusinessDropdownMenu
                            businesses={props.businesses}
                            selectedBusinessId={props.selectedBusinessId ?? null}
                            onChange={(id) => router.get('/dashboard', { business_id: id }, { preserveState: true })}
                        />
                    )}

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                            <DashboardSlot slot="top-left" moduleId={layout['top-left']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['top-left'], 'top-left')}
                            </DashboardSlot>
                        </div>

                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                            <DashboardSlot slot="top-right" moduleId={layout['top-right']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['top-right'], 'top-right')}
                            </DashboardSlot>
                        </div>

                        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70">
                            <DashboardSlot slot="middle" moduleId={layout['middle']} setLayout={setLayout}>
                                {DashboardRenderModule(layout['middle'], 'middle')}
                            </DashboardSlot>
                        </div>
                    </div>

                    <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min">
                        <DashboardSlot slot="bottom" moduleId={layout['bottom']} setLayout={setLayout}>
                            {DashboardRenderModule(layout['bottom'], 'bottom')}
                        </DashboardSlot>
                    </div>
                </div>
            </AppLayout>
        </DashboardDataProvider>
    );
}
