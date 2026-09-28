import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class LotStatus(str, enum.Enum):
    PENDING_ACCEPTANCE = "PENDING_ACCEPTANCE"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    AWAITING_HANDOVER = "AWAITING_HANDOVER"
    HANDOVER_IN_PROGRESS = "HANDOVER_IN_PROGRESS"
    VERIFIED = "VERIFIED"
    PAID = "PAID"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    CREATED = "CREATED"
    RECYCLER_SELECTED = "RECYCLER_SELECTED"
    HANDOVER_PENDING = "HANDOVER_PENDING"


class Lot(Base):
    __tablename__ = "lots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lot_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)

    collector_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    recycler_id: Mapped[Optional[int]] = mapped_column(ForeignKey("recyclers.id"), nullable=True)
    material_id: Mapped[int] = mapped_column(ForeignKey("materials.id"), nullable=False)

    declared_weight: Mapped[float] = mapped_column(Float, nullable=False)
    verified_weight: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    rate: Mapped[float] = mapped_column(Float, nullable=False)
    estimated_value: Mapped[float] = mapped_column(Float, nullable=False)
    final_amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    status: Mapped[LotStatus] = mapped_column(Enum(LotStatus, values_callable=lambda x: [e.value for e in x]), nullable=False, default=LotStatus.PENDING_ACCEPTANCE)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    verified_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    collector: Mapped["User"] = relationship("User", back_populates="lots_as_collector", foreign_keys=[collector_id])
    recycler: Mapped["Recycler"] = relationship("Recycler", back_populates="lots", foreign_keys=[recycler_id])
    material: Mapped["Material"] = relationship("Material", back_populates="lots")
    transaction: Mapped[Optional["Transaction"]] = relationship("Transaction", back_populates="lot", uselist=False)
