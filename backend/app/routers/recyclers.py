from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.recycler import Recycler
from app.models.user import User
from app.schemas.recycler import RecyclerOut
from app.schemas.lot import LotOut
from app.services.lot_service import LotService
from app.utils.dependencies import get_current_recycler

router = APIRouter(prefix="/api/recyclers", tags=["Recyclers"])


@router.get("", response_model=List[RecyclerOut])
def list_recyclers(db: Session = Depends(get_db)):
    return db.query(Recycler).all()


@router.get("/me/lots", response_model=List[LotOut])
def get_my_recycler_lots(
    db: Session = Depends(get_db),
    current_recycler: User = Depends(get_current_recycler)
):
    return LotService.get_user_lots(db, current_recycler)


@router.get("/{recycler_id}", response_model=RecyclerOut)
def get_recycler(recycler_id: int, db: Session = Depends(get_db)):
    recycler = db.query(Recycler).filter(Recycler.id == recycler_id).first()
    if not recycler:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recycler with ID {recycler_id} not found"
        )
    return recycler
