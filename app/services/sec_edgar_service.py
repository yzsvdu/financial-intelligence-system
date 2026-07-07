"""
sec_edgar_service.py
- fetch company CIK
- fetch latest 10-K / 10-Q metadata
- download filing text

"""

import requests
from bs4 import BeautifulSoup

from app.core.config import SEC_USER_AGENT


SEC_TICKER_URL = "https://www.sec.gov/files/company_tickers.json"
SEC_SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"
SEC_ARCHIVES_URL = "https://www.sec.gov/Archives/edgar/data/{cik}/{accession_no_dashes}/{primary_document}"


HEADERS = {
    "User-Agent": SEC_USER_AGENT,
    "Accept-Encoding": "gzip, deflate",
    "Host": "www.sec.gov",
}


DATA_HEADERS = {
    "User-Agent": SEC_USER_AGENT,
    "Accept-Encoding": "gzip, deflate",
    "Host": "data.sec.gov",
}


def _request_json(url: str) -> dict:
    response = requests.get(url, headers=DATA_HEADERS if "data.sec.gov" in url else HEADERS, timeout=30)
    response.raise_for_status()
    return response.json()


def _request_text(url: str) -> str:
    response = requests.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def get_cik_for_ticker(ticker: str) -> str:
    ticker = ticker.upper().strip()

    data = _request_json(SEC_TICKER_URL)

    for _, company in data.items():
        if company["ticker"].upper() == ticker:
            return str(company["cik_str"]).zfill(10)

    raise ValueError(f"No CIK found for ticker: {ticker}")


def get_company_submissions(cik: str) -> dict:
    cik = str(cik).zfill(10)
    url = SEC_SUBMISSIONS_URL.format(cik=cik)

    return _request_json(url)


def get_recent_filings(cik: str, form_types=None, limit: int = 5) -> list:
    if form_types is None:
        form_types = {"10-K", "10-Q", "8-K"}

    submissions = get_company_submissions(cik)
    recent = submissions["filings"]["recent"]

    filings = []

    for index, form_type in enumerate(recent["form"]):
        if form_type not in form_types:
            continue

        accession_number = recent["accessionNumber"][index]
        primary_document = recent["primaryDocument"][index]
        filing_date = recent["filingDate"][index]

        accession_no_dashes = accession_number.replace("-", "")

        filing_url = SEC_ARCHIVES_URL.format(
            cik=str(int(cik)),
            accession_no_dashes=accession_no_dashes,
            primary_document=primary_document,
        )

        filings.append({
            "form_type": form_type,
            "filing_date": filing_date,
            "accession_number": accession_number,
            "primary_document": primary_document,
            "filing_url": filing_url,
        })

        if len(filings) >= limit:
            break

    return filings


def download_filing_text(filing_url: str) -> str:
    html = _request_text(filing_url)

    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "table"]):
        tag.decompose()

    text = soup.get_text(separator="\n")

    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]

    return "\n".join(lines)