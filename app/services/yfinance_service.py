"""
yfinance_service.py
- fetch price history
- fetch basic financial metrics

"""
import pandas as pd
import yfinance as yf


def fetch_company_profile(ticker: str) -> dict:
    stock = yf.Ticker(ticker)
    info = stock.info

    if not info or info.get("quoteType") is None:
        raise ValueError(f"No company data found for ticker: {ticker}")

    return {
        "ticker": ticker.upper(),
        "name": info.get("longName") or info.get("shortName"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
    }


def fetch_price_history(ticker: str, period: str = "1y") -> list:
    stock = yf.Ticker(ticker)
    history = stock.history(period=period)

    prices = []

    for index, row in history.iterrows():
        prices.append({
            "date": index.date(),
            "open": float(row["Open"]) if row["Open"] is not None else None,
            "high": float(row["High"]) if row["High"] is not None else None,
            "low": float(row["Low"]) if row["Low"] is not None else None,
            "close": float(row["Close"]) if row["Close"] is not None else None,
            "volume": float(row["Volume"]) if row["Volume"] is not None else None,
        })

    return prices



def _safe_value(df: pd.DataFrame, row_name: str, column) -> float:
    if row_name not in df.index:
        return None

    value = df.loc[row_name, column]

    if pd.isna(value):
        return None

    return float(value)


def fetch_financial_statements(ticker: str, period: str = "annual") -> list:
    stock = yf.Ticker(ticker)

    if period == "quarterly":
        income_statement = stock.quarterly_financials
        balance_sheet = stock.quarterly_balance_sheet
        cash_flow = stock.quarterly_cashflow
    else:
        income_statement = stock.financials
        balance_sheet = stock.balance_sheet
        cash_flow = stock.cashflow

    statements = []

    for column in income_statement.columns:
        fiscal_date = column.date().isoformat()

        statement = {
            "period": period,
            "fiscal_date": fiscal_date,

            "revenue": _safe_value(income_statement, "Total Revenue", column),
            "gross_profit": _safe_value(income_statement, "Gross Profit", column),
            "operating_income": _safe_value(income_statement, "Operating Income", column),
            "net_income": _safe_value(income_statement, "Net Income", column),

            "total_assets": _safe_value(balance_sheet, "Total Assets", column),
            "total_liabilities": _safe_value(balance_sheet, "Total Liabilities Net Minority Interest", column),
            "total_equity": _safe_value(balance_sheet, "Stockholders Equity", column),

            "operating_cash_flow": _safe_value(cash_flow, "Operating Cash Flow", column),
            "free_cash_flow": _safe_value(cash_flow, "Free Cash Flow", column),
        }

        statements.append(statement)

    return statements