from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base


class FinancialStatement(Base):
    __tablename__ = "financial_statements"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False, index=True)

    period = Column(String(32), nullable=False)      # annual or quarterly
    fiscal_date = Column(String(32), nullable=False) # example: 2024-09-30

    revenue = Column(Float, nullable=True)
    gross_profit = Column(Float, nullable=True)
    operating_income = Column(Float, nullable=True)
    net_income = Column(Float, nullable=True)

    total_assets = Column(Float, nullable=True)
    total_liabilities = Column(Float, nullable=True)
    total_equity = Column(Float, nullable=True)

    operating_cash_flow = Column(Float, nullable=True)
    free_cash_flow = Column(Float, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    company = relationship("Company")

    __table_args__ = (
        UniqueConstraint("company_id", "period", "fiscal_date", name="uq_statement_company_period_date"),
    )