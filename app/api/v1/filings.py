from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db
from app.models.document_chunk import DocumentChunk
from app.models.filing import Filing
from app.services.chunking_service import refresh_filing_chunks

router = APIRouter(
    prefix="/filings",
    tags=["Filings"],
)


@router.post("/{filing_id}/chunks/refresh")
async def refresh_chunks(
    filing_id: int,
    max_chars: int = 3000,
    overlap_chars: int = 300,
    db: Session = Depends(get_db),
):
    filing, count = refresh_filing_chunks(
        db=db,
        filing_id=filing_id,
        max_chars=max_chars,
        overlap_chars=overlap_chars,
    )

    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")

    return {
        "filing_id": filing.id,
        "form_type": filing.form_type,
        "filing_date": filing.filing_date,
        "status": "chunks_refreshed",
        "chunks": count,
    }


@router.get("/{filing_id}/chunks")
async def get_chunks(
    filing_id: int,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    filing = db.query(Filing).filter(Filing.id == filing_id).first()

    if not filing:
        raise HTTPException(status_code=404, detail="Filing not found")

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.filing_id == filing_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .limit(limit)
        .all()
    )

    return {
        "filing_id": filing.id,
        "total_returned": len(chunks),
        "chunks": [
            {
                "id": chunk.id,
                "chunk_index": chunk.chunk_index,
                "text_preview": chunk.text[:500],
                "text_length": len(chunk.text),
            }
            for chunk in chunks
        ],
    }