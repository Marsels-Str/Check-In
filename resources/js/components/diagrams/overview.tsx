import BusinessPanel from './tiny-ui/BusinessPanel';
import PersonalPanel from './tiny-ui/PersonalPanel';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';

export default function OverviewCard() {
    const { overview } = useDashboardData();

    const users = overview?.users ?? [];
    const self = overview?.self;
    const empty = overview?.empty;

    if (empty === 'nothing-to-show') {
        return (
            <div className="h-64 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                Get a job, to view this panel.
            </div>
        );
    }

    if (self) {
        return <PersonalPanel self={self} />
    }

    return <BusinessPanel users={users ?? []} />
}
