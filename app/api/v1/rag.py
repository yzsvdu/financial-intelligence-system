from app.services.rag_service import answer_question
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db

router = APIRouter(
    prefix="/rag",
    tags=["rag"]
)

class RagAnswerRequest(BaseModel):
    query: str
    ticker: str
    limit: int = 5

@router.post("/answer")
async def rag_answer(
    request: RagAnswerRequest,
    db: Session = Depends(get_db),
):
    return answer_question(
        db=db,
        ticker=request.ticker,
        query=request.query,
        limit=request.limit,
    )