from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models import MarketPrice
from app.models.filing import Filing
from app.models.financial_statement import FinancialStatement
from app.services.company_service import get_company_by_ticker, ingest_company as ingest_company_service, \
    refresh_market_prices, refresh_financial_statements, refresh_sec_filings
from app.services.dashboard_service import build_company_dashboard

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


class CompanyIngestRequest(BaseModel):
    ticker: str
    force_refresh: bool = False

@router.post("/ingest")
async def ingest_company(
    request: CompanyIngestRequest,
    db: Session = Depends(get_db),
):
    try:
        company, status = ingest_company_service(
            db,
            request.ticker,
            force_refresh=request.force_refresh,
        )

    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))

    return {
        "id": company.id,
        "ticker": company.ticker,
        "name": company.name,
        "sector": company.sector,
        "industry": company.industry,
        "cik": company.cik,
        "status": status,
    }


@router.get("/{ticker}")
async def get_company(
    ticker: str,
    db: Session = Depends(get_db),
):
    company = get_company_by_ticker(db, ticker)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    return {
        "id": company.id,
        "ticker": company.ticker,
        "name": company.name,
        "sector": company.sector,
        "industry": company.industry,
        "cik": company.cik,
    }


@router.post("/{ticker}/market-data/refresh")
async def refresh_company_market_data(
    ticker: str,
    period: str = "1y",
    db: Session = Depends(get_db),
):
    company, count = refresh_market_prices(db, ticker, period=period)

    return {
        "ticker": company.ticker,
        "status": "market_data_refreshed",
        "records": count,
    }


@router.get("/{ticker}/market-data")
async def get_company_market_data(
    ticker: str,
    db: Session = Depends(get_db),
):
    ticker = ticker.upper().strip()

    company = get_company_by_ticker(db, ticker)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    prices = (
        db.query(MarketPrice)
        .filter(MarketPrice.company_id == company.id)
        .order_by(MarketPrice.date.asc())
        .all()
    )

    return {
        "ticker": company.ticker,
        "prices": [
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
    }


@router.post("/{ticker}/financial-statements/refresh")
async def refresh_company_financial_statements(
    ticker: str,
    period: str = "annual",
    db: Session = Depends(get_db),
):
    company, count = refresh_financial_statements(db, ticker, period=period)

    return {
        "ticker": company.ticker,
        "period": period,
        "status": "financial_statements_refreshed",
        "records": count,
    }


@router.get("/{ticker}/financial-statements")
async def get_company_financial_statements(
    ticker: str,
    period: str = "annual",
    db: Session = Depends(get_db),
):
    company = get_company_by_ticker(db, ticker)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    statements = (
        db.query(FinancialStatement)
        .filter(
            FinancialStatement.company_id == company.id,
            FinancialStatement.period == period,
        )
        .order_by(FinancialStatement.fiscal_date.asc())
        .all()
    )

    return {
        "ticker": company.ticker,
        "period": period,
        "statements": [
            {
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
            }
            for statement in statements
        ],
    }


@router.get("/{ticker}/dashboard")
async def get_company_dashboard(
    ticker: str,
    db: Session = Depends(get_db),
):
    dashboard = build_company_dashboard(db, ticker)

    if not dashboard:
        raise HTTPException(status_code=404, detail="Company not found")

    return dashboard



@router.post("/{ticker}/filings/refresh")
async def refresh_company_filings(
    ticker: str,
    form_type: str = "10-K",
    limit: int = 1,
    db: Session = Depends(get_db),
):
    try:
        company, count = refresh_sec_filings(
            db=db,
            ticker=ticker,
            form_type=form_type,
            limit=limit,
        )
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error))

    return {
        "ticker": company.ticker,
        "cik": company.cik,
        "form_type": form_type,
        "status": "filings_refreshed",
        "records": count,
    }


@router.get("/{ticker}/filings")
async def get_company_filings(
    ticker: str,
    db: Session = Depends(get_db),
):
    company = get_company_by_ticker(db, ticker)

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    filings = (
        db.query(Filing)
        .filter(Filing.company_id == company.id)
        .order_by(Filing.filing_date.desc())
        .all()
    )

    return {
        "ticker": company.ticker,
        "filings": [
            {
                "id": filing.id,
                "form_type": filing.form_type,
                "filing_date": filing.filing_date,
                "accession_number": filing.accession_number,
                "primary_document": filing.primary_document,
                "filing_url": filing.filing_url,
                "text_length": len(filing.raw_text or ""),
            }
            for filing in filings
        ],
    }