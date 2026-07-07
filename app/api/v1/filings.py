from fastapi import APIRouter

router = APIRouter(
    prefix="/filings",
    tags=["Filings"]
)