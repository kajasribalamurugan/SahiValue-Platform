import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class PaymentMethod(str, enum.Enum):
    CASH = "CASH"
    UPI = "UPI"
    BANK_TRANSFER = "BANK_TRANSFER"


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lot_id: Mapped[int] = mapped_column(ForeignKey("lots.id"), unique=True, nullable=False)
    collector_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    recycler_id: Mapped[int] = mapped_column(ForeignKey("recyclers.id"), nullable=False)

    verified_weight: Mapped[float] = mapped_column(Float, nullable=False)
    rate: Mapped[float] = mapped_column(Float, nullable=False)
    final_amount: Mapped[float] = mapped_column(Float, nullable=False)

    payment_method: Mapped[PaymentMethod] = mapped_column(Enum(PaymentMethod), nullable=False, default=PaymentMethod.UPI)
    payment_status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), nullable=False, default=PaymentStatus.PAID)
    transaction_reference: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lot: Mapped["Lot"] = relationship("Lot", back_populates="transaction")
    collector: Mapped["User"] = relationship("User", back_populates="transactions_as_collector", foreign_keys=[collector_id])
    recycler: Mapped["Recycler"] = relationship("Recycler", back_populates="transactions", foreign_keys=[recycler_id])
