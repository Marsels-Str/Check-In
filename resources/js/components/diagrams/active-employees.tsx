import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import type { DiagramState, EmployeeActivityPoint } from '@/types';

type Props = DiagramState<EmployeeActivityPoint>;

export default function EmployeeActivityDiagram({ data, range }: Props) {
    return (
        <div className="h-64 rounded-xl p-4">
            <p className="mb-2 font-semibold">
                Employee activity
            </p>

            <RangeToggle range={range} param="range_activity"/>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        formatter={(value) => {
                            const count = typeof value === 'number' ? value : 0;
                            return [count, 'Employees'];
                        }}
                    />
                    <Bar
                        dataKey="count"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
