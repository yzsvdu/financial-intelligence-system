from fastapi import APIRouter

router = APIRouter(
    prefix="/rag",
    tags=["rag"]
)

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import embed_text

router = APIRouter(
    prefix="/rag",
    tags=["RAG"],
)


class RagSearchRequest(BaseModel):
    query: str
    limit: int = 5


@router.post("/search")
async def semantic_search(
    request: RagSearchRequest,
    db: Session = Depends(get_db),
):
    query_embedding = embed_text(request.query)

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.embedding.isnot(None))
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(request.limit)
        .all()
    )

    return {
        "query": request.query,
        "results": [
            {
                "chunk_id": chunk.id,
                "filing_id": chunk.filing_id,
                "chunk_index": chunk.chunk_index,
                "text_preview": chunk.text[:800],
            }
            for chunk in chunks
        ],
    }