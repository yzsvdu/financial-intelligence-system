import {
    Box,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    Paper,
    Typography,
} from "@mui/material";

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { useEffect, useState } from "react";
import { getCompanyDashboard } from "../services/companyService";

type DashboardData = {
    company: {
        ticker: string;
        name: string | null;
        sector: string | null;
        industry: string | null;
        cik: string | null;
    };
    market: {
        latest_close: number | null;
        latest_price_date: string | null;
        latest_volume: number | null;
        price_change_30d_pct: number | null;
        high_52w: number | null;
        low_52w: number | null;
        avg_volume: number | null;
        price_history: {
            date: string;
            open: number | null;
            high: number | null;
            low: number | null;
            close: number | null;
            volume: number | null;
        }[];
    };
    financials: {
        fiscal_date: string;
        revenue: number | null;
        gross_profit: number | null;
        operating_income: number | null;
        net_income: number | null;
        total_assets: number | null;
        total_liabilities: number | null;
        total_equity: number | null;
        operating_cash_flow: number | null;
        free_cash_flow: number | null;
        gross_margin: number | null;
        operating_margin: number | null;
        net_margin: number | null;
        debt_ratio: number | null;
        equity_ratio: number | null;
    }[];
    kpis: {
        revenue_growth_pct: number | null;
        net_income_growth_pct: number | null;
        free_cash_flow_growth_pct: number | null;
        gross_margin: number | null;
        operating_margin: number | null;
        net_margin: number | null;
        debt_ratio: number | null;
        equity_ratio: number | null;
    };
    filings: {
        latest_filing: string | null;
        latest_filing_date: string | null;
        latest_filing_id: number | null;
        filing_count: number;
        chunk_count: number;
        embedded_chunk_count: number;
        embedding_coverage_pct: number | null;
    };
};

type CompanyDashboardPanelProps = {
    ticker: string | null;
};

function formatCurrency(value: number | null | undefined) {
    if (value == null) return "N/A";

    return `$${value.toFixed(2)}`;
}

function formatBillions(value: number | null | undefined) {
    if (value == null) return "N/A";

    return `$${(value / 1_000_000_000).toFixed(1)}B`;
}

function formatNumber(value: number | null | undefined) {
    if (value == null) return "N/A";

    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

function safePercent(value: number | null | undefined) {
    if (value == null) return "N/A";

    return `${value.toFixed(1)}%`;
}

function yearLabel(date: string) {
    return date.slice(0, 4);
}

function toBillions(value: number | null) {
    if (value == null) return null;

    return value / 1_000_000_000;
}

function buildAnalytics(data: DashboardData) {
    const financials = data.financials.filter((row) => row.revenue != null);
    const latest = financials[financials.length - 1];

    const marginHistory = financials.map((row) => ({
        year: yearLabel(row.fiscal_date),
        grossMargin: row.gross_margin,
        operatingMargin: row.operating_margin,
        netMargin: row.net_margin,
    }));

    const performanceHistory = financials.map((row) => ({
        year: yearLabel(row.fiscal_date),
        revenue: toBillions(row.revenue),
        netIncome: toBillions(row.net_income),
    }));

    const balanceSheetHistory = financials.map((row) => ({
        year: yearLabel(row.fiscal_date),
        assets: toBillions(row.total_assets),
        liabilities: toBillions(row.total_liabilities),
        equity: toBillions(row.total_equity),
    }));

    const cashFlowHistory = financials.map((row) => ({
        year: yearLabel(row.fiscal_date),
        operatingCashFlow: toBillions(row.operating_cash_flow),
        freeCashFlow: toBillions(row.free_cash_flow),
    }));

    const capitalStructure = latest
        ? [
              {
                  name: "Liabilities",
                  value: toBillions(latest.total_liabilities),
              },
              {
                  name: "Equity",
                  value: toBillions(latest.total_equity),
              },
          ].filter((item) => item.value != null)
        : [];

    return {
        latest,
        marginHistory,
        performanceHistory,
        balanceSheetHistory,
        cashFlowHistory,
        capitalStructure,
    };
}

function KpiCard({
    label,
    value,
    helper,
}: {
    label: string;
    value: string;
    helper?: string;
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.5,
                height: "100%",
                bgcolor: "background.default",
                borderColor: "#1f2937",
            }}
        >
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>

            <Typography
                variant="h6"
                sx={{
                    mt: 0.5,
                    fontWeight: 800,
                }}
            >
                {value}
            </Typography>

            {helper && (
                <Typography variant="caption" color="text.secondary">
                    {helper}
                </Typography>
            )}
        </Paper>
    );
}

function ChartCard({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: React.ReactNode;
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2,
                height: 280,
                bgcolor: "background.default",
                borderColor: "#1f2937",
            }}
        >
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
                {subtitle}
            </Typography>

            <Box sx={{ height: 220, mt: 1 }}>
                {children}
            </Box>
        </Paper>
    );
}

export default function CompanyDashboardPanel({
    ticker,
}: CompanyDashboardPanelProps) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!ticker) {
            setData(null);
            return;
        }

        setLoading(true);
        setError(null);

        getCompanyDashboard(ticker)
            .then((dashboard) => {
                setData(dashboard);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load dashboard.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [ticker]);

    if (!ticker) {
        return (
            <Paper
                sx={{
                    height: "100%",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography color="text.secondary">
                    Select a company from the watchlist to load analytics.
                </Typography>
            </Paper>
        );
    }

    if (loading) {
        return (
            <Paper sx={{ height: "100%", p: 2 }}>
                <Typography sx={{ fontWeight: 800 }}>
                    Loading {ticker} dashboard...
                </Typography>
                <LinearProgress sx={{ mt: 2 }} />
            </Paper>
        );
    }

    if (error || !data) {
        return (
            <Paper sx={{ height: "100%", p: 2 }}>
                <Typography color="error.main">
                    {error ?? "No dashboard data available."}
                </Typography>
            </Paper>
        );
    }

    const analytics = buildAnalytics(data);
    const latest = analytics.latest;
    const embeddingCoverage = data.filings.embedding_coverage_pct ?? 0;

    return (
        <Paper
            sx={{
                height: "100%",
                p: 2,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                        {data.company.ticker}
                    </Typography>

                    <Typography color="text.secondary">
                        {data.company.name ?? "Unknown company"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                        {data.company.sector ?? "Unknown sector"} •{" "}
                        {data.company.industry ?? "Unknown industry"} • CIK{" "}
                        {data.company.cik ?? "N/A"}
                    </Typography>
                </Box>

                <Chip label="Data Ready" color="success" size="small" />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ overflowY: "auto", pr: 1 }}>
                <Grid container spacing={1.5}>
                    <Grid size={2}>
                        <KpiCard
                            label="Latest Close"
                            value={formatCurrency(data.market.latest_close)}
                            helper={`${safePercent(data.market.price_change_30d_pct)} 30D`}
                        />
                    </Grid>

                    <Grid size={2}>
                        <KpiCard
                            label="Revenue"
                            value={formatBillions(latest?.revenue)}
                            helper={`${safePercent(data.kpis.revenue_growth_pct)} YoY`}
                        />
                    </Grid>

                    <Grid size={2}>
                        <KpiCard
                            label="Gross Margin"
                            value={safePercent(data.kpis.gross_margin)}
                            helper="Gross profit / revenue"
                        />
                    </Grid>

                    <Grid size={2}>
                        <KpiCard
                            label="Operating Margin"
                            value={safePercent(data.kpis.operating_margin)}
                            helper="Operating income / revenue"
                        />
                    </Grid>

                    <Grid size={2}>
                        <KpiCard
                            label="Net Margin"
                            value={safePercent(data.kpis.net_margin)}
                            helper="Net income / revenue"
                        />
                    </Grid>

                    <Grid size={2}>
                        <KpiCard
                            label="Debt Ratio"
                            value={safePercent(data.kpis.debt_ratio)}
                            helper="Liabilities / assets"
                        />
                    </Grid>

                    <Grid size={6}>
                        <ChartCard
                            title="Stock Price"
                            subtitle="Close price from market_prices"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.market.price_history}>
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
                                            `$${Number(value).toFixed(2)}`,
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
                    </Grid>

                    <Grid size={6}>
                        <ChartCard
                            title="Revenue vs Net Income"
                            subtitle="Annual financial performance from financial_statements"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.performanceHistory}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="year"
                                        label={{
                                            value: "Fiscal Year",
                                            position: "insideBottom",
                                            offset: -5,
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: "USD Billions",
                                            angle: -90,
                                            position: "insideLeft",
                                        }}
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            `$${Number(value).toFixed(1)}B`,
                                            "",
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
                    </Grid>

                    <Grid size={4}>
                        <ChartCard
                            title="Margin Trend"
                            subtitle="Derived ratios from income statement fields"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.marginHistory}>
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
                                        formatter={(value) => [
                                            `${Number(value).toFixed(1)}%`,
                                            "",
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
                    </Grid>

                    <Grid size={4}>
                        <ChartCard
                            title="Cash Flow"
                            subtitle="Operating cash flow vs free cash flow"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analytics.cashFlowHistory}>
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
                                        formatter={(value) => [
                                            `$${Number(value).toFixed(1)}B`,
                                            "",
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
                    </Grid>

                    <Grid size={4}>
                        <ChartCard
                            title="Capital Structure"
                            subtitle="Latest liabilities vs equity"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip
                                        formatter={(value) => [
                                            `$${Number(value).toFixed(1)}B`,
                                            "",
                                        ]}
                                    />
                                    <Legend />
                                    <Pie
                                        data={analytics.capitalStructure}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={85}
                                        paddingAngle={4}
                                    >
                                        <Cell fill="#5eead4" />
                                        <Cell fill="#60a5fa" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Grid>

                    <Grid size={6}>
                        <ChartCard
                            title="Assets vs Liabilities"
                            subtitle="Balance sheet scale over time"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.balanceSheetHistory}>
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
                                        formatter={(value) => [
                                            `$${Number(value).toFixed(1)}B`,
                                            "",
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
                    </Grid>

                    <Grid size={6}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 2,
                                height: 280,
                                bgcolor: "background.default",
                                borderColor: "#1f2937",
                            }}
                        >
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                Filing & RAG Coverage
                            </Typography>

                            <Typography variant="caption" color="text.secondary">
                                Derived from filings and document_chunks
                            </Typography>

                            <Box sx={{ mt: 3 }}>
                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Latest Filing
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.filings.latest_filing ?? "N/A"}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Filing Date
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.filings.latest_filing_date ?? "N/A"}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        SEC Filings
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.filings.filing_count}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Document Chunks
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.filings.chunk_count}
                                    </Typography>
                                </Box>

                                <Box display="flex" justifyContent="space-between" sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Embedded Chunks
                                    </Typography>
                                    <Typography variant="body2">
                                        {data.filings.embedded_chunk_count}
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 3 }}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="body2" color="text.secondary">
                                            Embedding Coverage
                                        </Typography>
                                        <Typography variant="body2">
                                            {safePercent(embeddingCoverage)}
                                        </Typography>
                                    </Box>

                                    <LinearProgress
                                        variant="determinate"
                                        value={embeddingCoverage}
                                        sx={{
                                            mt: 1,
                                            height: 8,
                                            borderRadius: 99,
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
}