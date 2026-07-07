from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class Filing(Base):
    __tablename__ = "filings"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)

    form_type = Column(String(32), nullable=False)      # 10-K, 10-Q, 8-K
    filing_date = Column(String(32), nullable=False)
    accession_number = Column(String(64), nullable=False)
    primary_document = Column(String(255), nullable=False)
    filing_url = Column(String(1024), nullable=False)

    raw_text = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company")

    __table_args__ = (
        UniqueConstraint("company_id", "accession_number", name="uq_filing_company_accession"),
    )