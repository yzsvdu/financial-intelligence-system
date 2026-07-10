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

export default function StockPriceChart({
    data,
}: StockPriceChartProps) {
    return (
        <ChartCard
            title="Stock Price"
            subtitle="Close price from market_prices"
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis
                        label={{
                            value: "USD",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />

                    <Tooltip
                        formatter={(value) => [
                            formatCurrencyTooltip(value),
                            "Close",
                        ]}
                    />

                    <Legend />

                    <Area
                        type="monotone"
                        dataKey="close"
                        name="Close Price"
                        stroke="#5eead4"
                        fill="#5eead4"
                        fillOpacity={0.15}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
}