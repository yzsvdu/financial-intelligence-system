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

export default function MarginTrendChart({
    data,
}: MarginTrendChartProps) {
    return (
        <ChartCard
            title="Margin Trend"
            subtitle="Derived ratios from income statement fields"
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />

                    <YAxis
                        label={{
                            value: "Percent",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />

                    <Tooltip
                        formatter={(value, name) => [
                            formatPercentTooltip(value),
                            name,
                        ]}
                    />

                    <Legend />

                    <Line
                        dataKey="grossMargin"
                        name="Gross Margin"
                        stroke="#5eead4"
                        strokeWidth={2}
                    />

                    <Line
                        dataKey="operatingMargin"
                        name="Operating Margin"
                        stroke="#60a5fa"
                        strokeWidth={2}
                    />

                    <Line
                        dataKey="netMargin"
                        name="Net Margin"
                        stroke="#fbbf24"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}