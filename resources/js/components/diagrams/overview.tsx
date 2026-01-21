import { useT } from '@/lib/t';
import BusinessPanel from './tiny-ui/BusinessPanel';
import PersonalPanel from './tiny-ui/PersonalPanel';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';

export default function OverviewCard() {
    const { overview } = useDashboardData();

    const users = overview?.users ?? [];
    const self = overview?.self;
    const empty = overview?.empty;

    const t = useT();

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl text-sm text-muted-foreground">
                {t('dashboard.diagrams.overview.empty')}
            </div>
        );
    }

    if (self) {
        return <PersonalPanel self={self} />;
    }

    return <BusinessPanel users={users ?? []} />;
}
