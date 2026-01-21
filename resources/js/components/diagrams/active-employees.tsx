import { useT } from '@/lib/t';
import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function EmployeeActivityDiagram() {
    const { activity } = useDashboardData();

    const data = activity?.data ?? [];
    const range = activity?.range ?? 'week';
    const empty = activity?.empty;

    const t = useT();

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl text-sm text-muted-foreground">
                {t('dashboard.diagrams.employees.activity.empty')}
            </div>
        );
    }

    return (
        <div className="h-64 rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">{t('dashboard.diagrams.employees.activity.title')}</p>

                <RangeToggle range={range} param="range_activity" />
            </div>

            <ResponsiveContainer width="100%" height="90%" initialDimension={{ width: 1, height: 1 }}>
                <BarChart data={data}>
                    <XAxis dataKey="label" stroke="#FF4081" />
                    <YAxis allowDecimals={false} stroke="#FF4081" />
                    <Tooltip
                        formatter={(value) => {
                            const count = typeof value === 'number' ? value : 0;
                            return [count, t('dashboard.diagrams.employees.activity.tooltip')];
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} stroke="#f0e4e8ff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
