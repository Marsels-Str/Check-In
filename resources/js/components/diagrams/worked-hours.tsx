import { DiagramState, WorkedHoursPoint } from '@/types';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';

type Props = DiagramState<WorkedHoursPoint>;

export default function WorkedHoursDiagram({ data, range }: Props) {
    return (
        <div className="h-64 rounded-xl p-4">
            <p className="mb-2 font-semibold">Worked hours</p>

            <RangeToggle range={range} param="range_hours"/>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis unit="h" />
                    <Tooltip />
                    <Bar dataKey="hours" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
