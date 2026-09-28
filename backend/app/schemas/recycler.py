from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.user import UserOut


class RecyclerOut(BaseModel):
    id: int
    user_id: int
    facility_name: str
    authorization_number: str
    verification_status: str
    location: str
    pickup_available: bool
    rating: float
    created_at: datetime
    user: Optional[UserOut] = None

    model_config = ConfigDict(from_attributes=True)
