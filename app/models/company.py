from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.core.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)

    ticker = Column(String(16), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    sector = Column(String(255), nullable=True)
    industry = Column(String(255), nullable=True)
    cik = Column(String(32), nullable=True, index=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())