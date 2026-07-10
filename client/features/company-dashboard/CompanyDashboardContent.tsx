import { Grid } from "@mui/material";

import type { DashboardData } from "./dashboard.types";
import { buildDashboardAnalytics } from "./dashboard.utils";

import StockPriceChart from "./components/StockPriceChart";
import PerformanceChart from "./components/PerformanceChart";
import CashFlowChart from "./components/CashFlowChart";
import CapitalStructureChart from "./components/CapitalStructureChart";
import BalanceSheetChart from "./components/BalanceSheetChart";
import MarginTrendChart from "./components/MarginTrendChard.tsx";
import KPIGrid from "./components/KPIGrid.tsx";

type CompanyDashboardContentProps = {
    data: DashboardData;
};

export default function CompanyDashboardContent({
    data,
}: CompanyDashboardContentProps) {
    const analytics = buildDashboardAnalytics(data);

    return (
        <Grid container spacing={1.5}>
            <KPIGrid
                data={data}
                latestFinancial={analytics.latestFinancial}
            />

            <Grid size={{ xs: 12, lg: 6 }}>
                <StockPriceChart data={data.market.price_history} />
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
                <PerformanceChart
                    data={analytics.performanceHistory}
                />
            </Grid>

            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <MarginTrendChart data={analytics.marginHistory} />
            </Grid>

            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <CashFlowChart data={analytics.cashFlowHistory} />
            </Grid>

            <Grid size={{ xs: 12, md: 6, xl: 4 }}>
                <CapitalStructureChart
                    data={analytics.capitalStructure}
                />
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }}>
                <BalanceSheetChart
                    data={analytics.balanceSheetHistory}
                />
            </Grid>

        </Grid>
    );
}