from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import embed_text
from app.services.llm_service import generate_answer


def retrieve_chunks(db: Session, query: str, limit: int = 5):
    query_embedding = embed_text(query)

    return (
        db.query(DocumentChunk)
        .filter(DocumentChunk.embedding.isnot(None))
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(limit)
        .all()
    )


def build_rag_prompt(query: str, chunks: list) -> str:
    context_blocks = []

    for index, chunk in enumerate(chunks, start=1):
        context_blocks.append(
            f"""
Source {index}
Filing ID: {chunk.filing_id}
Chunk ID: {chunk.id}

{chunk.text}
""".strip()
        )

    context = "\n\n---\n\n".join(context_blocks)

    return f"""
You are a financial research assistant.

Answer the user's question using only the provided SEC filing excerpts.
If the excerpts do not contain enough information, say that the filings do not provide enough context.
Do not make investment recommendations.

User question:
{query}

SEC filing excerpts:
{context}

Answer:
""".strip()


def answer_question(db: Session, query: str, limit: int = 5):
    chunks = retrieve_chunks(db, query=query, limit=limit)

    prompt = build_rag_prompt(query=query, chunks=chunks)

    answer = generate_answer(prompt)

    sources = [
        {
            "chunk_id": chunk.id,
            "filing_id": chunk.filing_id,
            "chunk_index": chunk.chunk_index,
            "text_preview": chunk.text[:300],
        }
        for chunk in chunks
    ]

    return {
        "query": query,
        "answer": answer,
        "sources": sources,
    }