from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Recycler(Base):
    __tablename__ = "recyclers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    facility_name: Mapped[str] = mapped_column(String(255), nullable=False)
    authorization_number: Mapped[str] = mapped_column(String(100), nullable=False)
    verification_status: Mapped[str] = mapped_column(String(50), default="VERIFIED")
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    pickup_available: Mapped[bool] = mapped_column(Boolean, default=True)
    rating: Mapped[float] = mapped_column(Float, default=4.8)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="recycler_profile")
    lots: Mapped[List["Lot"]] = relationship("Lot", back_populates="recycler", foreign_keys="Lot.recycler_id")
    transactions: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="recycler", foreign_keys="Transaction.recycler_id")
