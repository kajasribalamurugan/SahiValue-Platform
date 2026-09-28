from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Float, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Material(Base):
    __tablename__ = "materials"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    unit: Mapped[str] = mapped_column(String(20), default="kg")
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    co2_saved_per_kg: Mapped[float] = mapped_column(Float, default=1.5)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lots: Mapped[List["Lot"]] = relationship("Lot", back_populates="material")
    price_histories: Mapped[List["PriceHistory"]] = relationship("PriceHistory", back_populates="material")
