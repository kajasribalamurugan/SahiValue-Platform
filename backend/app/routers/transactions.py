from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionOut
from app.utils.dependencies import get_current_user

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


@router.get("", response_model=List[TransactionOut])
def get_user_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value == "COLLECTOR":
        return db.query(Transaction).filter(Transaction.collector_id == current_user.id).all()
    else:
        return db.query(Transaction).filter(Transaction.recycler_id == current_user.id).all()
