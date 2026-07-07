from sqlalchemy.orm import Session

from app.models.market_price import MarketPrice
from app.models.financial_statement import FinancialStatement
from app.services.company_service import get_company_by_ticker


def _safe_divide(numerator, denominator):
    if numerator is None or denominator in (None, 0):
        return None

    return numerator / denominator


def build_company_dashboard(db: Session, ticker: str):
    ticker = ticker.upper().strip()

    company = get_company_by_ticker(db, ticker)

    if not company:
        return None

    prices = (
        db.query(MarketPrice)
        .filter(MarketPrice.company_id == company.id)
        .order_by(MarketPrice.date.asc())
        .all()
    )

    statements = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.company_id == company.id,
            FinancialStatement.period == "annual",
        )
        .order_by(FinancialStatement.fiscal_date.asc())
        .all()
    )

    latest_price = prices[-1] if prices else None

    financials = []

    for statement in statements:
        gross_margin = _safe_divide(statement.gross_profit, statement.revenue)
        operating_margin = _safe_divide(statement.operating_income, statement.revenue)
        net_margin = _safe_divide(statement.net_income, statement.revenue)
        debt_to_assets = _safe_divide(statement.total_liabilities, statement.total_assets)

        financials.append({
            "fiscal_date": statement.fiscal_date,
            "revenue": statement.revenue,
            "gross_profit": statement.gross_profit,
            "operating_income": statement.operating_income,
            "net_income": statement.net_income,
            "operating_cash_flow": statement.operating_cash_flow,
            "free_cash_flow": statement.free_cash_flow,
            "gross_margin": gross_margin,
            "operating_margin": operating_margin,
            "net_margin": net_margin,
            "debt_to_assets": debt_to_assets,
        })

    return {
        "company": {
            "id": company.id,
            "ticker": company.ticker,
            "name": company.name,
            "sector": company.sector,
            "industry": company.industry,
            "cik": company.cik,
        },
        "latest_price": {
            "date": latest_price.date.isoformat(),
            "close": latest_price.close,
            "volume": latest_price.volume,
        } if latest_price else None,
        "price_history": [
            {
                "date": price.date.isoformat(),
                "close": price.close,
                "volume": price.volume,
            }
            for price in prices
        ],
        "financials": financials,
    }