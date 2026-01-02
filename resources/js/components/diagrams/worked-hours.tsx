import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import { DiagramState, WorkedHoursPoint } from '@/types';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = DiagramState<WorkedHoursPoint>;

export default function WorkedHoursDiagram({ data, range, empty }: Props) {
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
                <p className="font-semibold">Worked Hours</p>

                <RangeToggle range={range} param="range_hours" />
            </div>

            <ResponsiveContainer width="100%" height="90%">
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
