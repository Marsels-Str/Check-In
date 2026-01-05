import { dashboardModules } from '@/dashboard/registry';
import { Draggable } from '@/components/dashboard/dashboard-slot';
import type { DashboardSlot as Slot } from '@/dashboard/registry';

export function DashboardRenderModule(moduleId: keyof typeof dashboardModules | null, slot: Slot) {
    if (!moduleId) return null;

    const Component = dashboardModules[moduleId].component;

    return (
        <Draggable moduleId={moduleId} slot={slot}>
            <Component />
        </Draggable>
    );
}
