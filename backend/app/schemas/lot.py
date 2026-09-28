from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from app.models.lot import LotStatus
from app.schemas.user import UserOut
from app.schemas.recycler import RecyclerOut
from app.schemas.material import MaterialOut


class LotCreate(BaseModel):
    material_id: int
    declared_weight: float = Field(..., gt=0, description="Declared weight in kg")
    recycler_id: Optional[int] = None


class LotVerify(BaseModel):
    verified_weight: float = Field(..., gt=0, description="Physical verified weight measured by Recycler")


class LotOut(BaseModel):
    id: int
    lot_id: str
    collector_id: int
    recycler_id: Optional[int] = None
    material_id: int

    declared_weight: float
    verified_weight: Optional[float] = None

    rate: float
    estimated_value: float
    final_amount: Optional[float] = None

    status: LotStatus

    created_at: datetime
    updated_at: datetime
    verified_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    collector: Optional[UserOut] = None
    recycler: Optional[RecyclerOut] = None
    material: Optional[MaterialOut] = None

    model_config = ConfigDict(from_attributes=True)
