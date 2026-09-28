from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.transaction import PaymentMethod, PaymentStatus
from app.schemas.user import UserOut
from app.schemas.recycler import RecyclerOut


class TransactionCompleteRequest(BaseModel):
    payment_method: PaymentMethod = PaymentMethod.UPI
    transaction_reference: Optional[str] = None


class TransactionOut(BaseModel):
    id: int
    lot_id: int
    collector_id: int
    recycler_id: int

    verified_weight: float
    rate: float
    final_amount: float

    payment_method: PaymentMethod
    payment_status: PaymentStatus
    transaction_reference: Optional[str] = None

    created_at: datetime

    collector: Optional[UserOut] = None
    recycler: Optional[RecyclerOut] = None

    model_config = ConfigDict(from_attributes=True)


class CollectorEarningsOut(BaseModel):
    total_verified_earnings: float
    total_verified_recycled_kg: float
    completed_lots: int
    transactions: List[TransactionOut]
