import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import ChartCard from "../components/ChartCard.tsx";
import type { DashboardAnalytics } from "../dashboard.utils";
import { formatBillionsTooltip } from "../dashboard.utils";

type CashFlowChartProps = {
    data: DashboardAnalytics["cashFlowHistory"];
};

export default function CashFlowChart({
    data,
}: CashFlowChartProps) {
    return (
        <ChartCard
            title="Cash Flow"
            subtitle="Operating cash flow vs free cash flow"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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

                    <Bar
                        dataKey="operatingCashFlow"
                        name="Operating Cash Flow"
                        fill="#5eead4"
                    />

                    <Bar
                        dataKey="freeCashFlow"
                        name="Free Cash Flow"
                        fill="#60a5fa"
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}