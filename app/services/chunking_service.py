"""
chunking_service.py
- split filing text into chunks for RAG

"""

from sqlalchemy.orm import Session

from app.models.filing import Filing
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import embed_text


def chunk_text(text: str, max_chars: int = 3000, overlap_chars: int = 300) -> list:
    chunks = []
    start = 0

    while start < len(text):
        end = start + max_chars
        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        start = end - overlap_chars

    return chunks


def refresh_filing_chunks(
    db: Session,
    filing_id: int,
    max_chars: int = 3000,
    overlap_chars: int = 300,
):
    filing = db.query(Filing).filter(Filing.id == filing_id).first()

    if not filing:
        return None, 0

    if not filing.raw_text:
        return filing, 0

    db.query(DocumentChunk).filter(DocumentChunk.filing_id == filing_id).delete()

    chunks = chunk_text(
        filing.raw_text,
        max_chars=max_chars,
        overlap_chars=overlap_chars,
    )

    for index, chunk in enumerate(chunks):
        db.add(
            DocumentChunk(
                filing_id=filing.id,
                chunk_index=index,
                text=chunk,
            )
        )

    db.commit()

    return filing, len(chunks)



def refresh_chunk_embeddings(db: Session, filing_id: int):
    filing = db.query(Filing).filter(Filing.id == filing_id).first()

    if not filing:
        return None, 0

    chunks = (
        db.query(DocumentChunk)
        .filter(DocumentChunk.filing_id == filing_id)
        .order_by(DocumentChunk.chunk_index.asc())
        .all()
    )

    updated_count = 0

    for chunk in chunks:
        chunk.embedding = embed_text(chunk.text)
        updated_count += 1

    db.commit()

    return filing, updated_count