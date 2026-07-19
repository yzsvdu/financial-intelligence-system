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

import type { DashboardAnalytics } from "../dashboard.utils";
import { formatBillionsTooltip } from "../dashboard.utils";
import ChartCard from "../components/ChartCard";

type PerformanceChartProps = {
    data: DashboardAnalytics["performanceHistory"];
};

function formatBillionsTick(value: number) {
    if (!Number.isFinite(value)) {
        return "";
    }

    return `$${value.toFixed(0)}B`;
}

export default function PerformanceChart({
    data,
}: PerformanceChartProps) {
    return (
        <ChartCard
            title="Revenue vs Net Income"
            subtitle="Annual financial performance from financial_statements"
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
                        width={72}
                        tickFormatter={formatBillionsTick}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        label={{
                            value: "USD",
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
                            formatBillionsTooltip(value),
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
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#5eead4"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 4,
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="netIncome"
                        name="Net Income"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{
                            r: 4,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}