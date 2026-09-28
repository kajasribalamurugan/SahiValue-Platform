from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.models.user import UserRole


class UserOut(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    role: UserRole
    language: str
    location: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
