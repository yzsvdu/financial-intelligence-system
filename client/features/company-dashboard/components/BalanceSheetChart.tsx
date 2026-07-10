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
import { formatBillionsTooltip } from "../dashboard.utils";

type BalanceSheetChartProps = {
    data: DashboardAnalytics["balanceSheetHistory"];
};

export default function BalanceSheetChart({
    data,
}: BalanceSheetChartProps) {
    return (
        <ChartCard
            title="Assets vs Liabilities"
            subtitle="Balance sheet scale over time"
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
                        dataKey="assets"
                        name="Total Assets"
                        stroke="#5eead4"
                        strokeWidth={3}
                    />

                    <Line
                        dataKey="liabilities"
                        name="Total Liabilities"
                        stroke="#f87171"
                        strokeWidth={3}
                    />

                    <Line
                        dataKey="equity"
                        name="Total Equity"
                        stroke="#60a5fa"
                        strokeWidth={3}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}