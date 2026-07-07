from fastapi import APIRouter

from app.api.v1 import companies
from app.api.v1 import filings
from app.api.v1 import market_data
from app.api.v1 import rag

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(companies.router)
api_router.include_router(filings.router)
api_router.include_router(market_data.router)
api_router.include_router(rag.router)