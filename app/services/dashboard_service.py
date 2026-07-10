from sqlalchemy.orm import Session

from app.models.market_price import MarketPrice
from app.models.financial_statement import FinancialStatement
from app.models.filing import Filing
from app.models.document_chunk import DocumentChunk
from app.services.company_service import get_company_by_ticker


def _safe_divide(numerator, denominator):
    if numerator is None or denominator in (None, 0):
        return None

    return numerator / denominator


def _percent_change(current, previous):
    if current is None or previous in (None, 0):
        return None

    return ((current - previous) / previous) * 100


def _to_percent(value):
    if value is None:
        return None

    return value * 100


def _has_financial_data(statement):
    return any([
        statement.revenue,
        statement.gross_profit,
        statement.operating_income,
        statement.net_income,
        statement.total_assets,
        statement.total_liabilities,
        statement.total_equity,
        statement.operating_cash_flow,
        statement.free_cash_flow,
    ])


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

    statements = [
        statement for statement in statements
        if _has_financial_data(statement)
    ]

    filings = (
        db.query(Filing)
        .filter(Filing.company_id == company.id)
        .order_by(Filing.filing_date.desc())
        .all()
    )

    latest_price = prices[-1] if prices else None
    latest_statement = statements[-1] if statements else None
    previous_statement = statements[-2] if len(statements) >= 2 else None
    latest_filing = filings[0] if filings else None

    closes = [price.close for price in prices if price.close is not None]
    volumes = [price.volume for price in prices if price.volume is not None]

    high_52w = max(closes) if closes else None
    low_52w = min(closes) if closes else None
    avg_volume = sum(volumes) / len(volumes) if volumes else None

    price_change_30d_pct = None
    if len(prices) >= 30 and latest_price and prices[-30].close:
        price_change_30d_pct = _percent_change(
            latest_price.close,
            prices[-30].close,
        )

    revenue_growth_pct = None
    net_income_growth_pct = None
    free_cash_flow_growth_pct = None

    if latest_statement and previous_statement:
        revenue_growth_pct = _percent_change(
            latest_statement.revenue,
            previous_statement.revenue,
        )
        net_income_growth_pct = _percent_change(
            latest_statement.net_income,
            previous_statement.net_income,
        )
        free_cash_flow_growth_pct = _percent_change(
            latest_statement.free_cash_flow,
            previous_statement.free_cash_flow,
        )

    gross_margin = None
    operating_margin = None
    net_margin = None
    debt_ratio = None
    equity_ratio = None

    if latest_statement:
        gross_margin = _to_percent(
            _safe_divide(latest_statement.gross_profit, latest_statement.revenue)
        )
        operating_margin = _to_percent(
            _safe_divide(latest_statement.operating_income, latest_statement.revenue)
        )
        net_margin = _to_percent(
            _safe_divide(latest_statement.net_income, latest_statement.revenue)
        )
        debt_ratio = _to_percent(
            _safe_divide(latest_statement.total_liabilities, latest_statement.total_assets)
        )
        equity_ratio = _to_percent(
            _safe_divide(latest_statement.total_equity, latest_statement.total_assets)
        )

    filing_ids = [filing.id for filing in filings]

    chunk_count = 0
    embedded_chunk_count = 0

    if filing_ids:
        chunk_count = (
            db.query(DocumentChunk)
            .filter(DocumentChunk.filing_id.in_(filing_ids))
            .count()
        )

        embedded_chunk_count = (
            db.query(DocumentChunk)
            .filter(
                DocumentChunk.filing_id.in_(filing_ids),
                DocumentChunk.embedding.isnot(None),
            )
            .count()
        )

    embedding_coverage_pct = (
        (embedded_chunk_count / chunk_count) * 100
        if chunk_count > 0
        else None
    )

    financials = []

    for statement in statements:
        gross_margin_row = _to_percent(
            _safe_divide(statement.gross_profit, statement.revenue)
        )
        operating_margin_row = _to_percent(
            _safe_divide(statement.operating_income, statement.revenue)
        )
        net_margin_row = _to_percent(
            _safe_divide(statement.net_income, statement.revenue)
        )
        debt_ratio_row = _to_percent(
            _safe_divide(statement.total_liabilities, statement.total_assets)
        )
        equity_ratio_row = _to_percent(
            _safe_divide(statement.total_equity, statement.total_assets)
        )

        financials.append({
            "fiscal_date": statement.fiscal_date,

            "revenue": statement.revenue,
            "gross_profit": statement.gross_profit,
            "operating_income": statement.operating_income,
            "net_income": statement.net_income,

            "total_assets": statement.total_assets,
            "total_liabilities": statement.total_liabilities,
            "total_equity": statement.total_equity,

            "operating_cash_flow": statement.operating_cash_flow,
            "free_cash_flow": statement.free_cash_flow,

            "gross_margin": gross_margin_row,
            "operating_margin": operating_margin_row,
            "net_margin": net_margin_row,
            "debt_ratio": debt_ratio_row,
            "equity_ratio": equity_ratio_row,
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

        "market": {
            "latest_close": latest_price.close if latest_price else None,
            "latest_price_date": latest_price.date.isoformat() if latest_price else None,
            "latest_volume": latest_price.volume if latest_price else None,
            "price_change_30d_pct": price_change_30d_pct,
            "high_52w": high_52w,
            "low_52w": low_52w,
            "avg_volume": avg_volume,
            "price_history": [
                {
                    "date": price.date.isoformat(),
                    "open": price.open,
                    "high": price.high,
                    "low": price.low,
                    "close": price.close,
                    "volume": price.volume,
                }
                for price in prices
            ],
        },

        "financials": financials,

        "kpis": {
            "revenue_growth_pct": revenue_growth_pct,
            "net_income_growth_pct": net_income_growth_pct,
            "free_cash_flow_growth_pct": free_cash_flow_growth_pct,
            "gross_margin": gross_margin,
            "operating_margin": operating_margin,
            "net_margin": net_margin,
            "debt_ratio": debt_ratio,
            "equity_ratio": equity_ratio,
        },

        "filings": {
            "latest_filing": latest_filing.form_type if latest_filing else None,
            "latest_filing_date": latest_filing.filing_date if latest_filing else None,
            "latest_filing_id": latest_filing.id if latest_filing else None,
            "filing_count": len(filings),
            "chunk_count": chunk_count,
            "embedded_chunk_count": embedded_chunk_count,
            "embedding_coverage_pct": embedding_coverage_pct,
        },
    }