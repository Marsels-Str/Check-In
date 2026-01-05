import type { OverviewData } from '@/types';
import BusinessPanel from './tiny-ui/BusinessPanel';
import PersonalPanel from './tiny-ui/PersonalPanel';

type Props = OverviewData;

export default function OverviewCard({ users, self, empty }: Props) {
    if (empty === 'nothing-to-show') {
        return (
            <div className="h-64 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                Get a job, to view this panel.
            </div>
        );
    }

    if (self) {
        return <PersonalPanel self={self} />;
    }

    return <BusinessPanel users={users ?? []} />;
}
