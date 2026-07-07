from sqlalchemy import Column, ForeignKey, Integer, Text, UniqueConstraint
from sqlalchemy.orm import relationship

from app.core.database import Base


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)

    filing_id = Column(Integer, ForeignKey("filings.id"), nullable=False, index=True)

    chunk_index = Column(Integer, nullable=False)
    text = Column(Text, nullable=False)

    filing = relationship("Filing")

    __table_args__ = (
        UniqueConstraint("filing_id", "chunk_index", name="uq_chunk_filing_index"),
    )