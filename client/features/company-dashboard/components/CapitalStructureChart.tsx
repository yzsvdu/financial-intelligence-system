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
                <PieChart
                    margin={{
                        top: 12,
                        right: 16,
                        bottom: 12,
                        left: 16,
                    }}
                >
                    <Tooltip
                        formatter={(value, name) => [
                            formatBillionsTooltip(value),
                            name,
                        ]}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        iconType="circle"
                        iconSize={9}
                        wrapperStyle={{
                            paddingBottom: 8,
                            fontSize: 12,
                        }}
                    />

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="54%"
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={4}
                        stroke="none"
                    >
                    {data.map((item, index) => (
                        <Cell
                            key={item.name}
                            fill={
                                SLICE_COLORS[
                                    index %
                                        SLICE_COLORS.length
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