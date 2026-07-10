import type {
    DashboardData,
    FinancialStatement,
} from "./dashboard.types";

export function formatCurrency(
    value: number | null | undefined,
): string {
    if (value == null) {
        return "N/A";
    }

    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatBillions(
    value: number | null | undefined,
): string {
    if (value == null) {
        return "N/A";
    }

    return `$${(value / 1_000_000_000).toFixed(1)}B`;
}

export function formatCompactNumber(
    value: number | null | undefined,
): string {
    if (value == null) {
        return "N/A";
    }

    return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export function formatPercent(
    value: number | null | undefined,
): string {
    if (value == null) {
        return "N/A";
    }

    return `${value.toFixed(1)}%`;
}

export function formatBillionsTooltip(value: unknown): string {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        return "N/A";
    }

    return `$${numberValue.toFixed(1)}B`;
}

export function formatCurrencyTooltip(value: unknown): string {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        return "N/A";
    }

    return `$${numberValue.toFixed(2)}`;
}

export function formatPercentTooltip(value: unknown): string {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
        return "N/A";
    }

    return `${numberValue.toFixed(1)}%`;
}

function yearLabel(date: string): string {
    return date.slice(0, 4);
}

function toBillions(value: number | null): number | null {
    return value == null ? null : value / 1_000_000_000;
}

function getFinancialStatementsWithRevenue(
    financials: FinancialStatement[],
): FinancialStatement[] {
    return financials.filter((statement) => statement.revenue != null);
}

export function buildDashboardAnalytics(data: DashboardData) {
    const financials = getFinancialStatementsWithRevenue(data.financials);
    const latestFinancial = financials.at(-1) ?? null;

    const marginHistory = financials.map((statement) => ({
        year: yearLabel(statement.fiscal_date),
        grossMargin: statement.gross_margin,
        operatingMargin: statement.operating_margin,
        netMargin: statement.net_margin,
    }));

    const performanceHistory = financials.map((statement) => ({
        year: yearLabel(statement.fiscal_date),
        revenue: toBillions(statement.revenue),
        netIncome: toBillions(statement.net_income),
    }));

    const balanceSheetHistory = financials.map((statement) => ({
        year: yearLabel(statement.fiscal_date),
        assets: toBillions(statement.total_assets),
        liabilities: toBillions(statement.total_liabilities),
        equity: toBillions(statement.total_equity),
    }));

    const cashFlowHistory = financials.map((statement) => ({
        year: yearLabel(statement.fiscal_date),
        operatingCashFlow: toBillions(statement.operating_cash_flow),
        freeCashFlow: toBillions(statement.free_cash_flow),
    }));

    const capitalStructure = latestFinancial
        ? [
              {
                  name: "Liabilities",
                  value: toBillions(latestFinancial.total_liabilities),
              },
              {
                  name: "Equity",
                  value: toBillions(latestFinancial.total_equity),
              },
          ].filter(
              (
                  item,
              ): item is {
                  name: string;
                  value: number;
              } => item.value != null,
          )
        : [];

    return {
        latestFinancial,
        marginHistory,
        performanceHistory,
        balanceSheetHistory,
        cashFlowHistory,
        capitalStructure,
    };
}

export type DashboardAnalytics = ReturnType<
    typeof buildDashboardAnalytics
>;