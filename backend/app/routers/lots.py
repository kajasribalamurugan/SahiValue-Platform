from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.user import User
from app.schemas.lot import LotCreate, LotVerify, LotOut
from app.schemas.transaction import TransactionCompleteRequest
from app.services.lot_service import LotService
from app.utils.dependencies import get_current_user, get_current_collector, get_current_recycler

router = APIRouter(prefix="/api/lots", tags=["Lots"])


@router.post("", response_model=LotOut, status_code=status.HTTP_201_CREATED)
def create_lot(
    req: LotCreate,
    db: Session = Depends(get_db),
    collector: User = Depends(get_current_collector)
):
    return LotService.create_lot(db, collector, req)


@router.get("", response_model=List[LotOut])
def get_lots(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return LotService.get_user_lots(db, current_user)


@router.get("/available", response_model=List[LotOut])
def get_available_lots(
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.get_available_lots(db)


@router.get("/{lot_id}", response_model=LotOut)
def get_lot_details(
    lot_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return LotService.get_lot_by_identifier(db, current_user, lot_id)


@router.post("/{lot_id}/accept", response_model=LotOut)
def accept_lot(
    lot_id: str,
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.accept_lot(db, recycler, lot_id)


@router.post("/{lot_id}/reject", response_model=LotOut)
def reject_lot(
    lot_id: str,
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.reject_lot(db, recycler, lot_id)


@router.post("/{lot_id}/verify", response_model=LotOut)
def verify_lot_weight(
    lot_id: str,
    req: LotVerify,
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.verify_lot_weight(db, recycler, lot_id, req.verified_weight)


@router.post("/{lot_id}/handover", response_model=LotOut)
def handover_lot(
    lot_id: str,
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.handover_lot(db, recycler, lot_id)


@router.post("/{lot_id}/complete", response_model=LotOut)
def complete_lot(
    lot_id: str,
    req: TransactionCompleteRequest,
    db: Session = Depends(get_db),
    recycler: User = Depends(get_current_recycler)
):
    return LotService.complete_lot(db, recycler, lot_id, req)
