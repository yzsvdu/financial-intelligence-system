import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

import ChartCard from "../components/ChartCard";
import type { DashboardAnalytics } from "../dashboard.utils";
import { formatBillionsTooltip } from "../dashboard.utils";

type CapitalStructureChartProps = {
    data: DashboardAnalytics["capitalStructure"];
};

const SLICE_COLORS = ["#5eead4", "#60a5fa"];

export default function CapitalStructureChart({
    data,
}: CapitalStructureChartProps) {
    return (
        <ChartCard
            title="Capital Structure"
            subtitle="Latest liabilities vs equity"
        >
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        formatter={(value, name) => [
                            formatBillionsTooltip(value),
                            name,
                        ]}
                    />

                    <Legend />

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                    >
                        {data.map((item, index) => (
                            <Cell
                                key={item.name}
                                fill={
                                    SLICE_COLORS[
                                        index % SLICE_COLORS.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}