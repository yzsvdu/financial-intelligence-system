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

export default function PerformanceChart({
    data,
}: PerformanceChartProps) {
    return (
        <ChartCard
            title="Revenue vs Net Income"
            subtitle="Annual financial performance from financial_statements"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="year" />

                    <YAxis
                        label={{
                            value: "USD Billions",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            formatBillionsTooltip(value),
                            name,
                        ]}
                    />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke="#5eead4"
                        strokeWidth={3}
                    />

                    <Line
                        type="monotone"
                        dataKey="netIncome"
                        name="Net Income"
                        stroke="#60a5fa"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}