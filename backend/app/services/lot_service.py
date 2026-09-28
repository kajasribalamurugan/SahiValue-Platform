import random
from datetime import datetime
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session

from app.models.user import User, UserRole
from app.models.recycler import Recycler
from app.models.material import Material
from app.models.lot import Lot, LotStatus
from app.models.transaction import Transaction, PaymentMethod, PaymentStatus
from app.schemas.lot import LotCreate, LotVerify
from app.schemas.transaction import TransactionCompleteRequest


def generate_lot_id(db: Session) -> str:
    year = datetime.utcnow().year
    for _ in range(100):
        rand_suffix = f"{random.randint(1000, 9999)}"
        code = f"SV-{year}-{rand_suffix}"
        existing = db.query(Lot).filter(Lot.lot_id == code).first()
        if not existing:
            return code
    return f"SV-{year}-{random.randint(10000, 99999)}"


class LotService:
    @staticmethod
    def create_lot(db: Session, collector: User, req: LotCreate) -> Lot:
        # 1. Validate Material
        material = db.query(Material).filter(Material.id == req.material_id).first()
        if not material:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Material with ID {req.material_id} not found"
            )

        # 2. Validate Recycler if provided
        recycler_id = None
        if req.recycler_id:
            recycler = db.query(Recycler).filter(Recycler.id == req.recycler_id).first()
            if not recycler:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Recycler with ID {req.recycler_id} not found"
                )
            recycler_id = recycler.id

        # 3. Read rate from DB
        rate = material.rate

        # 4. Generate unique lot_id in SV-YYYY-XXXX format
        lot_code = generate_lot_id(db)

        # 5. Server calculates estimated_value
        estimated_value = round(req.declared_weight * rate, 2)

        lot = Lot(
            lot_id=lot_code,
            collector_id=collector.id,
            recycler_id=recycler_id,
            material_id=material.id,
            declared_weight=req.declared_weight,
            verified_weight=None,
            rate=rate,
            estimated_value=estimated_value,
            final_amount=None,
            status=LotStatus.PENDING_ACCEPTANCE
        )
        db.add(lot)
        db.commit()
        db.refresh(lot)
        return lot

    @staticmethod
    def get_user_lots(db: Session, user: User) -> List[Lot]:
        if user.role == UserRole.COLLECTOR:
            return db.query(Lot).filter(Lot.collector_id == user.id).all()
        elif user.role == UserRole.RECYCLER:
            recycler = db.query(Recycler).filter(Recycler.user_id == user.id).first()
            if not recycler:
                return db.query(Lot).filter(and_(Lot.recycler_id == None, Lot.status == LotStatus.PENDING_ACCEPTANCE)).all()
            return db.query(Lot).filter(
                or_(
                    Lot.recycler_id == recycler.id,
                    and_(Lot.recycler_id == None, Lot.status == LotStatus.PENDING_ACCEPTANCE)
                )
            ).all()
        return []

    @staticmethod
    def get_available_lots(db: Session) -> List[Lot]:
        return db.query(Lot).filter(
            or_(
                Lot.status == LotStatus.PENDING_ACCEPTANCE,
                Lot.status == LotStatus.CREATED
            )
        ).all()

    @staticmethod
    def accept_lot(db: Session, recycler_user: User, identifier: str) -> Lot:
        recycler = db.query(Recycler).filter(Recycler.user_id == recycler_user.id).first()
        if not recycler:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not registered as a recycler"
            )

        if identifier.isdigit():
            lot = db.query(Lot).filter(Lot.id == int(identifier)).first()
        else:
            lot = db.query(Lot).filter(Lot.lot_id == identifier).first()

        if not lot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lot not found"
            )

        if lot.status not in [LotStatus.PENDING_ACCEPTANCE, LotStatus.CREATED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lot is no longer pending acceptance or has already been accepted/rejected"
            )

        if lot.recycler_id is not None and lot.recycler_id != recycler.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lot is assigned to another recycler"
            )

        lot.recycler_id = recycler.id
        lot.status = LotStatus.ACCEPTED
        lot.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(lot)
        return lot

    @staticmethod
    def reject_lot(db: Session, recycler_user: User, identifier: str) -> Lot:
        recycler = db.query(Recycler).filter(Recycler.user_id == recycler_user.id).first()
        if not recycler:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is not registered as a recycler"
            )

        if identifier.isdigit():
            lot = db.query(Lot).filter(Lot.id == int(identifier)).first()
        else:
            lot = db.query(Lot).filter(Lot.lot_id == identifier).first()

        if not lot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lot not found"
            )

        if lot.status not in [LotStatus.PENDING_ACCEPTANCE, LotStatus.CREATED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lot is not pending acceptance"
            )

        lot.recycler_id = recycler.id
        lot.status = LotStatus.REJECTED
        lot.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(lot)
        return lot

    @staticmethod
    def get_lot_by_identifier(db: Session, user: User, identifier: str) -> Lot:
        # Check if identifier is int ID or lot_id string
        if identifier.isdigit():
            lot = db.query(Lot).filter(Lot.id == int(identifier)).first()
        else:
            lot = db.query(Lot).filter(Lot.lot_id == identifier).first()

        if not lot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lot not found"
            )

        # Authorization check: user must be either the collector or assigned recycler
        if user.role == UserRole.COLLECTOR and lot.collector_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this lot"
            )
        elif user.role == UserRole.RECYCLER:
            recycler = db.query(Recycler).filter(Recycler.user_id == user.id).first()
            if not recycler or (lot.recycler_id is not None and lot.recycler_id != recycler.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Not authorized to access this lot"
                )

        return lot

    @staticmethod
    def verify_lot_weight(db: Session, recycler_user: User, identifier: str, verified_weight: float) -> Lot:
        if verified_weight <= 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Verified weight must be greater than zero"
            )

        lot = LotService.get_lot_by_identifier(db, recycler_user, identifier)

        # CRITICAL BUSINESS RULE:
        # Server calculates final_amount = verified_weight * rate.
        # Client input for final_amount or rate is completely ignored.
        final_amount = round(verified_weight * lot.rate, 2)

        lot.verified_weight = verified_weight
        lot.final_amount = final_amount
        lot.status = LotStatus.VERIFIED
        lot.verified_at = datetime.utcnow()
        lot.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(lot)
        return lot

    @staticmethod
    def handover_lot(db: Session, recycler_user: User, identifier: str) -> Lot:
        lot = LotService.get_lot_by_identifier(db, recycler_user, identifier)
        lot.status = LotStatus.HANDOVER_PENDING
        lot.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(lot)
        return lot

    @staticmethod
    def complete_lot(db: Session, recycler_user: User, identifier: str, req: TransactionCompleteRequest) -> Lot:
        lot = LotService.get_lot_by_identifier(db, recycler_user, identifier)

        if lot.verified_weight is None or lot.final_amount is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lot weight must be verified by Recycler before completing transaction"
            )

        # Prevent duplicate transaction for the same lot
        existing_tx = db.query(Transaction).filter(Transaction.lot_id == lot.id).first()
        if existing_tx:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Transaction has already been completed for this lot"
            )

        tx = Transaction(
            lot_id=lot.id,
            collector_id=lot.collector_id,
            recycler_id=lot.recycler_id,
            verified_weight=lot.verified_weight,
            rate=lot.rate,
            final_amount=lot.final_amount,
            payment_method=req.payment_method,
            payment_status=PaymentStatus.PAID,
            transaction_reference=req.transaction_reference or f"TXN-{lot.lot_id}"
        )
        db.add(tx)

        lot.status = LotStatus.COMPLETED
        lot.completed_at = datetime.utcnow()
        lot.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(lot)
        return lot
