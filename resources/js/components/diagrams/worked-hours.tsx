import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function WorkedHoursDiagram() {
    const { workedHours } = useDashboardData();

    const data = workedHours?.data ?? [];
    const range = workedHours?.range ?? 'week';
    const empty = workedHours?.empty;

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
                <p className="font-semibold">Worked Hours</p>

                <RangeToggle range={range} param="range_hours" />
            </div>

            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <XAxis dataKey="label" stroke='#f0e4e8ff' />
                    <YAxis unit="h" stroke='#f0e4e8ff' />
                    <Tooltip />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]} stroke='#f0e4e8ff' />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
