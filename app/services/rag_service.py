from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.document_chunk import DocumentChunk
from app.models.filing import Filing
from app.services.embedding_service import embed_text
from app.services.llm_service import generate_answer


def build_retrieval_query(ticker: str, query: str) -> str:
    q = query.lower()
    expansions = []

    if any(word in q for word in ["employee", "employees", "headcount", "workforce"]):
        expansions = [
            "employees",
            "number of employees",
            "headcount",
            "workforce",
            "human capital",
            "full-time employees",
            "part-time employees",
        ]

    expanded_query = " ".join([query, *expansions])

    if ticker:
        return f"{ticker.upper().strip()} {expanded_query}"

    return expanded_query


def retrieve_chunks(
    db: Session,
    query: str,
    ticker: str,
    limit: int = 8,
):
    query_embedding = embed_text(query)

    db_query = (
        db.query(DocumentChunk)
        .join(Filing, DocumentChunk.filing_id == Filing.id)
        .filter(DocumentChunk.embedding.isnot(None))
    )

    if ticker:
        db_query = (
            db_query
            .join(Company, Filing.company_id == Company.id)
            .filter(Company.ticker == ticker.upper().strip())
        )

    return (
        db_query
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(limit)
        .all()
    )

def build_filing_prompt(query: str, chunks: list) -> str:
    context_blocks = []

    for index, chunk in enumerate(chunks, start=1):
        context_blocks.append(
            f"""
Source {index}
Filing ID: {chunk.filing_id}
Chunk Index: {chunk.chunk_index}

{chunk.text}
""".strip()
        )

    filing_context = "\n\n---\n\n".join(context_blocks)

    return f"""
You are an SEC filing question-answering assistant.

Answer the user's question using only the SEC filing excerpts below.

Rules:
- Use only the filing excerpts.
- Do not use outside knowledge.
- If the answer is not present, say:
  "I could not find that in the available SEC filing excerpts."
- Give a clear answer in 1 to 3 short paragraphs.
- Include source references like [Source 1], [Source 2] when using evidence.

User question:
{query}

SEC filing excerpts:
{filing_context}

Answer:
""".strip()

def answer_question(
    db: Session,
    query: str,
    ticker: str,
    limit: int = 8,
):
    ticker = ticker.upper().strip() if ticker else None

    retrieval_query = build_retrieval_query(ticker, query)

    chunks = retrieve_chunks(
        db=db,
        query=retrieval_query,
        ticker=ticker,
        limit=limit,
    )

    prompt = build_filing_prompt(
        query=query,
        chunks=chunks,
    )

    answer = generate_answer(prompt)

    return {
        "ticker": ticker,
        "query": query,
        "answer": answer,
        "mode": "sec_filings_only",
        "dashboard_used": False,
        "sources": [
            {
                "chunk_id": chunk.id,
                "filing_id": chunk.filing_id,
                "chunk_index": chunk.chunk_index,
                "text_preview": chunk.text[:300],
            }
            for chunk in chunks
        ],
    }