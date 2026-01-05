import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function EmployeeActivityDiagram() {
    const { activity } = useDashboardData();

    const data = activity?.data ?? [];
    const range = activity?.range ?? 'week';
    const empty = activity?.empty;

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl text-sm text-muted-foreground">
                Get a job, to view personal statistics.
            </div>
        );
    }

    return (
        <div className="h-64 rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
                <p className="font-semibold">Employee activity</p>

                <RangeToggle range={range} param="range_activity" />
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <XAxis dataKey="label" stroke='#f0e4e8ff' />
                    <YAxis allowDecimals={false} stroke='#f0e4e8ff' />
                    <Tooltip
                        formatter={(value) => {
                            const count = typeof value === 'number' ? value : 0;
                            return [count, 'Employees'];
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} stroke='#f0e4e8ff' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
