import type { DiagramState, EmployeeActivityPoint, MessageReminderState, OverviewData, WorkedHoursPoint } from '@/types';
import { createContext, useContext } from 'react';

type DashboardData = {
    workedHours?: DiagramState<WorkedHoursPoint>;
    activity?: DiagramState<EmployeeActivityPoint>;
    overview?: OverviewData;
    message?: MessageReminderState;
};

const DashboardDataContext = createContext<DashboardData>({});

export function DashboardDataProvider({ value, children }: { value: DashboardData; children: React.ReactNode }) {
    return <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>;
}

export function useDashboardData() {
    return useContext(DashboardDataContext);
}
