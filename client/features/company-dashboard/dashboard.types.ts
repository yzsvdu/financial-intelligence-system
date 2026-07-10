export type CompanyData = {
    ticker: string;
    name: string | null;
    sector: string | null;
    industry: string | null;
    cik: string | null;
};

export type PriceHistoryPoint = {
    date: string;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    volume: number | null;
};

export type MarketData = {
    latest_close: number | null;
    latest_price_date: string | null;
    latest_volume: number | null;
    price_change_30d_pct: number | null;
    high_52w: number | null;
    low_52w: number | null;
    avg_volume: number | null;
    price_history: PriceHistoryPoint[];
};

export type FinancialStatement = {
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
};

export type DashboardKpis = {
    revenue_growth_pct: number | null;
    net_income_growth_pct: number | null;
    free_cash_flow_growth_pct: number | null;
    gross_margin: number | null;
    operating_margin: number | null;
    net_margin: number | null;
    debt_ratio: number | null;
    equity_ratio: number | null;
};

export type FilingData = {
    latest_filing: string | null;
    latest_filing_date: string | null;
    latest_filing_id: number | null;
    filing_count: number;
    chunk_count: number;
    embedded_chunk_count: number;
    embedding_coverage_pct: number | null;
};

export type DashboardData = {
    company: CompanyData;
    market: MarketData;
    financials: FinancialStatement[];
    kpis: DashboardKpis;
    filings: FilingData;
};

export type CompanyDashboardPanelProps = {
    ticker: string | null;
};

export type ChartTooltipValue = number | string | null | undefined;