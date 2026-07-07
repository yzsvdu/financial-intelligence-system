"""
company_service.py
- given a ticker, find or create company record

"""

from sqlalchemy.orm import Session

from app.models import MarketPrice
from app.models.company import Company
from app.models.filing import Filing
from app.models.financial_statement import FinancialStatement
from app.services.sec_edgar_service import get_cik_for_ticker, get_recent_filings, download_filing_text
from app.services.yfinance_service import fetch_company_profile, fetch_price_history, fetch_financial_statements


def get_company_by_ticker(db: Session, ticker: str):
    ticker = ticker.upper().strip()

    return db.query(Company).filter(Company.ticker == ticker).first()


def ingest_company(db: Session, ticker: str, force_refresh: bool = False):
    ticker = ticker.upper().strip()

    existing_company = get_company_by_ticker(db, ticker)

    if existing_company and not force_refresh:
        return existing_company, "already_exists"

    profile = fetch_company_profile(ticker)

    if existing_company:
        existing_company.name = profile.get("name")
        existing_company.sector = profile.get("sector")
        existing_company.industry = profile.get("industry")

        db.commit()
        db.refresh(existing_company)

        return existing_company, "refreshed"

    company = Company(
        ticker=ticker,
        name=profile.get("name"),
        sector=profile.get("sector"),
        industry=profile.get("industry"),
        cik=None,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company, "created"



def refresh_market_prices(db: Session, ticker: str, period: str = "1y"):
    ticker = ticker.upper().strip()

    company = get_company_by_ticker(db, ticker)

    if not company:
        company, _ = ingest_company(db, ticker, force_refresh=True)

    price_rows = fetch_price_history(ticker, period=period)

    created_or_updated = 0

    for price in price_rows:
        existing_price = (
            db.query(MarketPrice)
            .filter(
                MarketPrice.company_id == company.id,
                MarketPrice.date == price["date"],
            )
            .first()
        )

        if existing_price:
            existing_price.open = price["open"]
            existing_price.high = price["high"]
            existing_price.low = price["low"]
            existing_price.close = price["close"]
            existing_price.volume = price["volume"]
        else:
            market_price = MarketPrice(
                company_id=company.id,
                date=price["date"],
                open=price["open"],
                high=price["high"],
                low=price["low"],
                close=price["close"],
                volume=price["volume"],
            )
            db.add(market_price)

        created_or_updated += 1

    db.commit()

    return company, created_or_updated


def refresh_financial_statements(db: Session, ticker: str, period: str = "annual"):
    ticker = ticker.upper().strip()

    company = get_company_by_ticker(db, ticker)

    if not company:
        company, _ = ingest_company(db, ticker, force_refresh=True)

    statement_rows = fetch_financial_statements(ticker, period=period)

    created_or_updated = 0

    for row in statement_rows:
        existing_statement = (
            db.query(FinancialStatement)
            .filter(
                FinancialStatement.company_id == company.id,
                FinancialStatement.period == row["period"],
                FinancialStatement.fiscal_date == row["fiscal_date"],
            )
            .first()
        )

        if existing_statement:
            existing_statement.revenue = row["revenue"]
            existing_statement.gross_profit = row["gross_profit"]
            existing_statement.operating_income = row["operating_income"]
            existing_statement.net_income = row["net_income"]
            existing_statement.total_assets = row["total_assets"]
            existing_statement.total_liabilities = row["total_liabilities"]
            existing_statement.total_equity = row["total_equity"]
            existing_statement.operating_cash_flow = row["operating_cash_flow"]
            existing_statement.free_cash_flow = row["free_cash_flow"]
        else:
            statement = FinancialStatement(
                company_id=company.id,
                period=row["period"],
                fiscal_date=row["fiscal_date"],
                revenue=row["revenue"],
                gross_profit=row["gross_profit"],
                operating_income=row["operating_income"],
                net_income=row["net_income"],
                total_assets=row["total_assets"],
                total_liabilities=row["total_liabilities"],
                total_equity=row["total_equity"],
                operating_cash_flow=row["operating_cash_flow"],
                free_cash_flow=row["free_cash_flow"],
            )

            db.add(statement)

        created_or_updated += 1

    db.commit()

    return company, created_or_updated



def refresh_sec_filings(db: Session, ticker: str, form_type: str = "10-K", limit: int = 1):
    ticker = ticker.upper().strip()

    company = get_company_by_ticker(db, ticker)

    if not company:
        company, _ = ingest_company(db, ticker, force_refresh=True)

    if not company.cik:
        cik = get_cik_for_ticker(ticker)
        company.cik = cik
        db.commit()
        db.refresh(company)

    filings = get_recent_filings(
        company.cik,
        form_types={form_type},
        limit=limit,
    )

    saved_count = 0

    for filing_data in filings:
        existing_filing = (
            db.query(Filing)
            .filter(
                Filing.company_id == company.id,
                Filing.accession_number == filing_data["accession_number"],
            )
            .first()
        )

        raw_text = download_filing_text(filing_data["filing_url"])

        if existing_filing:
            existing_filing.form_type = filing_data["form_type"]
            existing_filing.filing_date = filing_data["filing_date"]
            existing_filing.primary_document = filing_data["primary_document"]
            existing_filing.filing_url = filing_data["filing_url"]
            existing_filing.raw_text = raw_text
        else:
            filing = Filing(
                company_id=company.id,
                form_type=filing_data["form_type"],
                filing_date=filing_data["filing_date"],
                accession_number=filing_data["accession_number"],
                primary_document=filing_data["primary_document"],
                filing_url=filing_data["filing_url"],
                raw_text=raw_text,
            )

            db.add(filing)

        saved_count += 1

    db.commit()

    return company, saved_count