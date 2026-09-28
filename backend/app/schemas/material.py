from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class MaterialOut(BaseModel):
    id: int
    name: str
    category: str
    rate: float
    unit: str
    description: Optional[str] = None
    co2_saved_per_kg: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PriceHistoryOut(BaseModel):
    id: int
    material_id: int
    rate: float
    effective_from: datetime
    effective_to: Optional[datetime] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
