import enum
from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class UserRole(str, enum.Enum):
    COLLECTOR = "COLLECTOR"
    RECYCLER = "RECYCLER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.COLLECTOR)
    language: Mapped[str] = mapped_column(String(10), default="en")
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    recycler_profile: Mapped[Optional["Recycler"]] = relationship("Recycler", back_populates="user", uselist=False)
    lots_as_collector: Mapped[List["Lot"]] = relationship("Lot", back_populates="collector", foreign_keys="Lot.collector_id")
    transactions_as_collector: Mapped[List["Transaction"]] = relationship("Transaction", back_populates="collector", foreign_keys="Transaction.collector_id")
