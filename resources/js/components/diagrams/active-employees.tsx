import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import type { DiagramState, EmployeeActivityPoint } from '@/types';

type Props = DiagramState<EmployeeActivityPoint>;

export default function EmployeeActivityDiagram({ data, range, empty }: Props) {
    if (empty === 'nothing-to-show') {
        return (
            <div className="h-64 rounded-xl flex items-center justify-center text-muted-foreground text-sm">
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
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        formatter={(value) => {
                            const count = typeof value === 'number' ? value : 0;
                            return [count, 'Employees'];
                        }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
