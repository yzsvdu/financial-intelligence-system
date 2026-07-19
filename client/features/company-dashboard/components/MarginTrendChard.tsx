import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import ChartCard from "../components/ChartCard";
import type { DashboardAnalytics } from "../dashboard.utils";
import { formatPercentTooltip } from "../dashboard.utils";

type MarginTrendChartProps = {
    data: DashboardAnalytics["marginHistory"];
};

function formatPercentTick(value: number) {
    if (!Number.isFinite(value)) {
        return "";
    }

    return `${value.toFixed(0)}%`;
}

export default function MarginTrendChart({
    data,
}: MarginTrendChartProps) {
    return (
        <ChartCard
            title="Margin Trend"
            subtitle="Derived ratios from income statement fields"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 12,
                        right: 16,
                        bottom: 16,
                        left: 12,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="year"
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                        height={36}
                    />

                    <YAxis
                        width={64}
                        tickFormatter={formatPercentTick}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        label={{
                            value: "%",
                            angle: -90,
                            position: "insideLeft",
                            offset: 10,
                            style: {
                                textAnchor: "middle",
                            },
                        }}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            formatPercentTooltip(value),
                            name,
                        ]}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{
                            paddingBottom: 8,
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="grossMargin"
                        name="Gross Margin"
                        stroke="#5eead4"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="operatingMargin"
                        name="Operating Margin"
                        stroke="#60a5fa"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />

                    <Line
                        type="monotone"
                        dataKey="netMargin"
                        name="Net Margin"
                        stroke="#fbbf24"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}