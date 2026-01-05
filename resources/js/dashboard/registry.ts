import OverviewCard from '@/components/diagrams/overview';
import WorkedHoursDiagram from '@/components/diagrams/worked-hours';
import MessageReminder from '@/components/diagrams/message-reminder';
import EmployeeActivityDiagram from '@/components/diagrams/active-employees';

export type DashboardModuleId =
  | 'worked-hours'
  | 'active-employees'
  | 'overview'
  | 'message-reminder';

export type DashboardSlot =
  | 'top-left'
  | 'top-right'
  | 'middle'
  | 'bottom';

export type DashboardLayout = Record<DashboardSlot, DashboardModuleId | null>;

export const dashboardModules = {
  'worked-hours': {
    id: 'worked-hours',
    title: 'Worked Hours',
    component: WorkedHoursDiagram,
    size: 'medium',
  },

  'active-employees': {
    id: 'active-employees',
    title: 'Active Employees',
    component: EmployeeActivityDiagram,
    size: 'small',
  },

  'message-reminder': {
    id: 'message-reminder',
    title: 'Messages',
    component: MessageReminder,
    size: 'medium',
  },

  'overview': {
    id: 'overview',
    title: 'Overview',
    component: OverviewCard,
    size: 'large',
  },
};

export const defaultLayout: DashboardLayout = {
  'top-left': 'overview',
  'top-right': 'message-reminder',
  'middle': 'active-employees',
  'bottom': 'worked-hours',
};
