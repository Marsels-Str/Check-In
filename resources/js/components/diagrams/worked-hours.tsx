import { useT } from '@/lib/t';
import RangeToggle from '@/components/diagrams/tiny-ui/range-toggle';
import { useDashboardData } from '@/components/dashboard/dashboard-data-context';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function WorkedHoursDiagram() {
    const { workedHours } = useDashboardData();

    const data = workedHours?.data ?? [];
    const range = workedHours?.range ?? 'week';
    const empty = workedHours?.empty;

    const t = useT();

    if (empty === 'nothing-to-show') {
        return (
            <div className="flex h-64 items-center justify-center rounded-xl itlalic text-muted-foreground">
                {t('dashboard.diagrams.hours.empty')}
            </div>
        );
    }

    return (
        <div className="h-64 p-2">
            <div className="flex justify-between">
                <p className="font-bold">{t('dashboard.diagrams.hours.title')}</p>

                <RangeToggle range={range} param="range_hours" />
            </div>

            <ResponsiveContainer width="100%" height="90%" initialDimension={{ width: 1, height: 1 }}>
                <BarChart data={data}>
                    <XAxis dataKey="label" tickFormatter={(value) => t(value)} stroke="#FF4081" />
                    <YAxis unit="h" stroke="#FF4081" />
                    <Tooltip labelFormatter={(value) => t(value)} />
                    <Bar dataKey="hours" name={t('dashboard.diagrams.hours.name')} radius={[4, 4, 0, 0]} stroke="#f0e4e8ff" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
