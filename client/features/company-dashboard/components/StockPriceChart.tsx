import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import type { PriceHistoryPoint } from "../dashboard.types";
import { formatCurrencyTooltip } from "../dashboard.utils";
import ChartCard from "../components/ChartCard";

type StockPriceChartProps = {
    data: PriceHistoryPoint[];
};

function formatDateTick(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
    });
}

function formatPriceTick(value: number) {
    return `$${Math.round(value)}`;
}

export default function StockPriceChart({
    data,
}: StockPriceChartProps) {
    return (
        <ChartCard
            title="Stock Price"
            subtitle="Close price from market_prices"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 12,
                        right: 16,
                        bottom: 24,
                        left: 12,
                    }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatDateTick}
                        minTickGap={32}
                        tickMargin={10}
                        axisLine={false}
                        tickLine={false}
                        height={42}
                    />

                    <YAxis
                        width={64}
                        tickFormatter={formatPriceTick}
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                        domain={["auto", "auto"]}
                        label={{
                            value: "USD",
                            angle: -90,
                            position: "insideLeft",
                            offset: 8,
                            style: {
                                textAnchor: "middle",
                            },
                        }}
                    />

                    <Tooltip
                        formatter={(value) => [
                            formatCurrencyTooltip(value),
                            "Close",
                        ]}
                        labelFormatter={(label) => {
                            const date = new Date(label);

                            return Number.isNaN(date.getTime())
                                ? label
                                : date.toLocaleDateString(
                                      "en-US",
                                      {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                      },
                                  );
                        }}
                    />

                    <Legend
                        verticalAlign="top"
                        align="right"
                        wrapperStyle={{
                            paddingBottom: 8,
                        }}
                    />

                    <Area
                        type="monotone"
                        dataKey="close"
                        name="Close Price"
                        stroke="#5eead4"
                        fill="#5eead4"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                            r: 4,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}