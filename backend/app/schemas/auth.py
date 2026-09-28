from typing import Optional
from pydantic import BaseModel, EmailStr
from app.schemas.user import UserOut


class CollectorRegister(BaseModel):
    name: str
    phone: str
    password: str
    language: str = "en"
    location: Optional[str] = None


class RecyclerRegister(BaseModel):
    name: str
    phone: str
    email: EmailStr
    password: str
    facility_name: str
    authorization_number: str
    location: str
    pickup_available: bool = True


class LoginRequest(BaseModel):
    phone: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
