import { Grid } from "@mui/material";

import type {
    DashboardData,
    FinancialStatement,
} from "../dashboard.types";
import {
    formatBillions,
    formatCurrency,
    formatPercent,
} from "../dashboard.utils";
import KpiCard from "./KpiCard";

type KpiGridProps = {
    data: DashboardData;
    latestFinancial: FinancialStatement | null;
};

export default function KPIGrid({
    data,
    latestFinancial,
}: KpiGridProps) {
    const cards = [
        {
            label: "Latest Close",
            value: formatCurrency(data.market.latest_close),
            helper: `${formatPercent(
                data.market.price_change_30d_pct,
            )} 30D`,
        },
        {
            label: "Revenue",
            value: formatBillions(latestFinancial?.revenue),
            helper: `${formatPercent(
                data.kpis.revenue_growth_pct,
            )} YoY`,
        },
        {
            label: "Gross Margin",
            value: formatPercent(data.kpis.gross_margin),
            helper: "Gross profit / revenue",
        },
        {
            label: "Operating Margin",
            value: formatPercent(data.kpis.operating_margin),
            helper: "Operating income / revenue",
        },
        {
            label: "Net Margin",
            value: formatPercent(data.kpis.net_margin),
            helper: "Net income / revenue",
        },
        {
            label: "Debt Ratio",
            value: formatPercent(data.kpis.debt_ratio),
            helper: "Liabilities / assets",
        },
    ];

    return (
        <>
            {cards.map((card) => (
                <Grid key={card.label} size={{ xs: 12, sm: 6, lg: 2 }}>
                    <KpiCard {...card} />
                </Grid>
            ))}
        </>
    );
}