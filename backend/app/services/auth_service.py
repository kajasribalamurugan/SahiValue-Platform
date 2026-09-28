from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.recycler import Recycler
from app.schemas.auth import CollectorRegister, RecyclerRegister, LoginRequest, TokenResponse
from app.schemas.user import UserOut
from app.utils.security import hash_password, verify_password, create_access_token


class AuthService:
    @staticmethod
    def register_collector(db: Session, req: CollectorRegister) -> TokenResponse:
        existing_user = db.query(User).filter(User.phone == req.phone).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this phone number already exists"
            )

        user = User(
            name=req.name,
            phone=req.phone,
            password_hash=hash_password(req.password),
            role=UserRole.COLLECTOR,
            language=req.language,
            location=req.location
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )

    @staticmethod
    def register_recycler(db: Session, req: RecyclerRegister) -> TokenResponse:
        existing_user = db.query(User).filter(User.phone == req.phone).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User with this phone number already exists"
            )

        user = User(
            name=req.name,
            phone=req.phone,
            email=req.email,
            password_hash=hash_password(req.password),
            role=UserRole.RECYCLER,
            location=req.location
        )
        db.add(user)
        db.flush()

        recycler = Recycler(
            user_id=user.id,
            facility_name=req.facility_name,
            authorization_number=req.authorization_number,
            location=req.location,
            pickup_available=req.pickup_available
        )
        db.add(recycler)
        db.commit()
        db.refresh(user)

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )

    @staticmethod
    def login(db: Session, req: LoginRequest) -> TokenResponse:
        user = db.query(User).filter(User.phone == req.phone).first()
        if not user or not verify_password(req.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid phone number or password"
            )

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return TokenResponse(
            access_token=token,
            token_type="bearer",
            user=UserOut.model_validate(user)
        )
