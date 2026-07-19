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

import ChartCard from "../components/ChartCard";
import type { DashboardAnalytics } from "../dashboard.utils";
import { formatBillionsTooltip } from "../dashboard.utils";

type CashFlowChartProps = {
    data: DashboardAnalytics["cashFlowHistory"];
};

function formatBillionsTick(value: number) {
    if (!Number.isFinite(value)) {
        return "";
    }

    return `$${value.toFixed(0)}B`;
}

export default function CashFlowChart({
    data,
}: CashFlowChartProps) {
    return (
        <ChartCard
            title="Cash Flow"
            subtitle="Operating cash flow vs free cash flow"
        >
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
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

                    <Bar
                        dataKey="operatingCashFlow"
                        name="Operating Cash Flow"
                        fill="#5eead4"
                        radius={[4, 4, 0, 0]}
                    />

                    <Bar
                        dataKey="freeCashFlow"
                        name="Free Cash Flow"
                        fill="#60a5fa"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}