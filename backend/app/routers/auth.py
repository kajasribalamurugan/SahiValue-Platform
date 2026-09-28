from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.auth import CollectorRegister, RecyclerRegister, LoginRequest, TokenResponse
from app.schemas.user import UserOut
from app.services.auth_service import AuthService
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register/collector", response_model=TokenResponse)
def register_collector(req: CollectorRegister, db: Session = Depends(get_db)):
    return AuthService.register_collector(db, req)


@router.post("/register/recycler", response_model=TokenResponse)
def register_recycler(req: RecyclerRegister, db: Session = Depends(get_db)):
    return AuthService.register_recycler(db, req)


@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    return AuthService.login(db, req)


@router.get("/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
